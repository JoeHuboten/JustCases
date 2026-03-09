import crypto from 'crypto';
import {
  sendEmail,
  sendEmailVerification,
  sendEmailVerificationSuccess,
  sendNewsletterWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
} from '@/lib/email';
import { createLogger } from '@/lib/logger';

type EmailTemplatePayload = {
  subject: string;
  html: string;
  text: string;
};

type EmailJobInput =
  | {
      type: 'ORDER_CONFIRMATION';
      to: string;
      payload: Parameters<typeof sendOrderConfirmationEmail>[1];
    }
  | {
      type: 'PASSWORD_RESET';
      to: string;
      payload: Parameters<typeof sendPasswordResetEmail>[1];
    }
  | {
      type: 'EMAIL_VERIFICATION';
      to: string;
      payload: Parameters<typeof sendEmailVerification>[1];
    }
  | {
      type: 'EMAIL_VERIFICATION_SUCCESS';
      to: string;
      payload: Parameters<typeof sendEmailVerificationSuccess>[1];
    }
  | {
      type: 'NEWSLETTER_WELCOME';
      to: string;
      payload: Parameters<typeof sendNewsletterWelcomeEmail>[1];
    }
  | {
      type: 'RAW_TEMPLATE';
      to: string;
      payload: EmailTemplatePayload;
    };

type EmailJob = EmailJobInput & {
  id: string;
  attempts: number;
  queuedAt: string;
};

interface QueueSummary {
  processed: number;
  succeeded: number;
  failed: number;
  requeued: number;
  remaining: number;
  deadLetter: number;
}

const logger = createLogger('email-queue');
const EMAIL_QUEUE_KEY = 'jobs:email';
const EMAIL_DEAD_LETTER_KEY = 'jobs:email:failed';
const MAX_ATTEMPTS = 3;
const MAX_BATCH_SIZE = 100;

const memoryQueue: EmailJob[] = [];
const memoryDeadLetter: Array<{ job: EmailJob; error: string; failedAt: string }> = [];
let memoryDrainScheduled = false;

function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function callRedisPipeline(commands: unknown[][]): Promise<unknown[]> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Redis is not configured');

  const response = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Redis request failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Unexpected Redis response format');
  }

  return data.map((entry: { result?: unknown }) => entry?.result);
}

async function callRedisCommand(command: unknown[]): Promise<unknown> {
  const [result] = await callRedisPipeline([command]);
  return result;
}

async function dispatchEmailJob(job: EmailJob) {
  switch (job.type) {
    case 'ORDER_CONFIRMATION':
      return sendOrderConfirmationEmail(job.to, job.payload);
    case 'PASSWORD_RESET':
      return sendPasswordResetEmail(job.to, job.payload);
    case 'EMAIL_VERIFICATION':
      return sendEmailVerification(job.to, job.payload);
    case 'EMAIL_VERIFICATION_SUCCESS':
      return sendEmailVerificationSuccess(job.to, job.payload);
    case 'NEWSLETTER_WELCOME':
      return sendNewsletterWelcomeEmail(job.to, job.payload);
    case 'RAW_TEMPLATE':
      return sendEmail(job.to, job.payload);
    default:
      return { success: false, error: 'Unsupported email job type' };
  }
}

function normalizeLimit(limit: number): number {
  if (!Number.isFinite(limit)) return 10;
  return Math.min(MAX_BATCH_SIZE, Math.max(1, Math.floor(limit)));
}

function createJob(input: EmailJobInput): EmailJob {
  return {
    ...input,
    id: crypto.randomUUID(),
    attempts: 0,
    queuedAt: new Date().toISOString(),
  };
}

function parseJob(raw: string): EmailJob | null {
  try {
    const parsed = JSON.parse(raw) as EmailJob;
    if (
      typeof parsed?.id === 'string' &&
      typeof parsed?.type === 'string' &&
      typeof parsed?.to === 'string' &&
      typeof parsed?.attempts === 'number'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

async function popJobs(limit: number): Promise<EmailJob[]> {
  if (isRedisConfigured()) {
    const commands = Array.from({ length: limit }, () => ['LPOP', EMAIL_QUEUE_KEY] as unknown[]);
    const values = await callRedisPipeline(commands);
    const jobs: EmailJob[] = [];
    for (const value of values) {
      if (typeof value !== 'string') continue;
      const parsed = parseJob(value);
      if (!parsed) {
        logger.warn('Skipped invalid email job payload from queue');
        continue;
      }
      jobs.push(parsed);
    }
    return jobs;
  }

  const jobs: EmailJob[] = [];
  while (jobs.length < limit && memoryQueue.length > 0) {
    const next = memoryQueue.shift();
    if (next) jobs.push(next);
  }
  return jobs;
}

async function pushJob(job: EmailJob) {
  const serialized = JSON.stringify(job);
  if (isRedisConfigured()) {
    await callRedisCommand(['RPUSH', EMAIL_QUEUE_KEY, serialized]);
    return;
  }
  memoryQueue.push(job);
}

async function pushDeadLetter(job: EmailJob, errorMessage: string) {
  const payload = JSON.stringify({
    ...job,
    error: errorMessage,
    failedAt: new Date().toISOString(),
  });
  if (isRedisConfigured()) {
    await callRedisCommand(['RPUSH', EMAIL_DEAD_LETTER_KEY, payload]);
    return;
  }
  memoryDeadLetter.push({
    job,
    error: errorMessage,
    failedAt: new Date().toISOString(),
  });
}

function scheduleMemoryDrain() {
  if (memoryDrainScheduled) return;
  memoryDrainScheduled = true;
  const timer = setTimeout(() => {
    memoryDrainScheduled = false;
    void processEmailJobs({ limit: 10 });
  }, 0);
  if (typeof timer === 'object' && 'unref' in timer) {
    (timer as NodeJS.Timeout).unref();
  }
}

async function getQueueLength(): Promise<number> {
  if (isRedisConfigured()) {
    const size = await callRedisCommand(['LLEN', EMAIL_QUEUE_KEY]);
    return Number(size || 0);
  }
  return memoryQueue.length;
}

async function getDeadLetterLength(): Promise<number> {
  if (isRedisConfigured()) {
    const size = await callRedisCommand(['LLEN', EMAIL_DEAD_LETTER_KEY]);
    return Number(size || 0);
  }
  return memoryDeadLetter.length;
}

export function isEmailQueueRedisBacked(): boolean {
  return isRedisConfigured();
}

export async function enqueueEmailJob(input: EmailJobInput): Promise<{ jobId: string }> {
  const job = createJob(input);

  if (isRedisConfigured()) {
    await pushJob(job);
    return { jobId: job.id };
  }

  memoryQueue.push(job);
  scheduleMemoryDrain();
  return { jobId: job.id };
}

export async function enqueueEmailJobs(inputs: EmailJobInput[]): Promise<{ queued: number }> {
  if (inputs.length === 0) {
    return { queued: 0 };
  }

  const jobs = inputs.map(createJob);

  if (isRedisConfigured()) {
    const command: unknown[] = ['RPUSH', EMAIL_QUEUE_KEY, ...jobs.map((job) => JSON.stringify(job))];
    await callRedisCommand(command);
    return { queued: jobs.length };
  }

  memoryQueue.push(...jobs);
  scheduleMemoryDrain();
  return { queued: jobs.length };
}

export async function processEmailJobs(options?: { limit?: number }): Promise<QueueSummary> {
  const limit = normalizeLimit(options?.limit ?? 10);
  const jobs = await popJobs(limit);

  let succeeded = 0;
  let failed = 0;
  let requeued = 0;

  for (const job of jobs) {
    try {
      const result = await dispatchEmailJob(job);
      if (!result.success) {
        throw new Error(String(result.error || 'Email provider failed'));
      }
      succeeded += 1;
    } catch (error) {
      failed += 1;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const nextAttempt = job.attempts + 1;

      if (nextAttempt < MAX_ATTEMPTS) {
        await pushJob({
          ...job,
          attempts: nextAttempt,
        });
        requeued += 1;
      } else {
        await pushDeadLetter(
          {
            ...job,
            attempts: nextAttempt,
          },
          errorMessage,
        );
      }
    }
  }

  const [remaining, deadLetter] = await Promise.all([getQueueLength(), getDeadLetterLength()]);

  return {
    processed: jobs.length,
    succeeded,
    failed,
    requeued,
    remaining,
    deadLetter,
  };
}

export async function getEmailQueueStats(): Promise<{ queued: number; deadLetter: number }> {
  const [queued, deadLetter] = await Promise.all([getQueueLength(), getDeadLetterLength()]);
  return { queued, deadLetter };
}
