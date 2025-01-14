import { newToast } from '$lib/toast/toast';

const debug = import.meta.env.DEV;

export function forwardConsole({ level, message }: RecordPayload) {
	switch (level) {
		case LogLevel.Trace:
			if (debug) newToast('info', message);
			break;

		case LogLevel.Debug:
			if (debug) newToast('info', message);
			break;

		case LogLevel.Info:
			if (debug) newToast('info', message);
			break;

		case LogLevel.Warn:
			newToast('warning', message);
			break;

		case LogLevel.Error:
			newToast('error', message);
			break;

		default:
			throw new Error(`unknown log level ${String(level)}`);
	}
}

interface RecordPayload {
	level: LogLevel;
	message: string;
}

enum LogLevel {
	/**
	 * The "trace" level.
	 *
	 * Designates very low priority, often extremely verbose, information.
	 */
	Trace = 1,
	/**
	 * The "debug" level.
	 *
	 * Designates lower priority information.
	 */
	Debug = 2,
	/**
	 * The "info" level.
	 *
	 * Designates useful information.
	 */
	Info = 3,
	/**
	 * The "warn" level.
	 *
	 * Designates hazardous situations.
	 */
	Warn = 4,
	/**
	 * The "error" level.
	 *
	 * Designates very serious errors.
	 */
	Error = 5
}
