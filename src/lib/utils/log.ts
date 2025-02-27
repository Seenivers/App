import { newToast } from '$lib/toast/toast';

const debug = import.meta.env.DEV;

export function forwardConsole({ level, message }: RecordPayload) {
	switch (level) {
		case LogLevel.Trace:
		case LogLevel.Debug:
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
			throw new Error(`Unknown log level: ${String(level)}`);
	}
}

interface RecordPayload {
	level: LogLevel;
	message: string;
}

enum LogLevel {
	/** Very low priority, often extremely verbose information. */
	Trace = 1,
	/** Lower priority debug information. */
	Debug = 2,
	/** Useful informational messages. */
	Info = 3,
	/** Indicates hazardous situations. */
	Warn = 4,
	/** Indicates serious errors. */
	Error = 5
}
