--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE
	__new_settings (
		key TEXT PRIMARY KEY NOT NULL,
		value TEXT NOT NULL
	);

INSERT INTO
	__new_settings (key, value)
SELECT
	'language',
	json_quote(COALESCE(language, 'en'))
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'keywords',
	COALESCE(keywords, '[]')
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'ignoredKeywords',
	COALESCE(ignoredKeywords, '[]')
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'theme',
	json_quote(COALESCE(theme, 'Default'))
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'adult',
	json (
		CASE
			WHEN adult = 1 THEN 'true'
			ELSE 'false'
		END
	)
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'toastPosition',
	COALESCE(
		toastPosition,
		'{"horizontal":"end","vertical":"bottom"}'
	)
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'player',
	json_quote(COALESCE(player, 'Plyr'))
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'castImages',
	json (COALESCE(castImages, 5))
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'discordAktiv',
	json (
		CASE
			WHEN discordAktiv = 1 THEN 'true'
			ELSE 'false'
		END
	)
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'backupInterval',
	json_quote(COALESCE(backupInterval, 'manual'))
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'backupConfig',
	COALESCE(
		backupConfig,
		'{"maxAgeDays":0,"maxBackups":14,"maxSizeMB":0}'
	)
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'watchPaths',
	COALESCE(watchPaths, '[]')
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'tmdbAccountID',
	CASE
		WHEN tmdbAccountID IS NULL THEN 'null'
		ELSE json_quote(tmdbAccountID)
	END
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'tmdbAccessToken',
	CASE
		WHEN tmdbAccessToken IS NULL THEN 'null'
		ELSE json_quote(tmdbAccessToken)
	END
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'tmdbGuestSessionId',
	CASE
		WHEN tmdbGuestSessionId IS NULL THEN 'null'
		ELSE json_quote(tmdbGuestSessionId)
	END
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'tmdbGuestSessionCreatedAt',
	json (COALESCE(tmdbGuestSessionCreatedAt, 0))
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'sentryEnabled',
	json (
		CASE
			WHEN sentryEnabled = 1 THEN 'true'
			ELSE 'false'
		END
	)
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'sentrySampleRate',
	json (COALESCE(sentrySampleRate, 100))
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'sentryReplaySampleRate',
	json (COALESCE(sentryReplaySampleRate, 10))
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'sentryReplayOnErrorSampleRate',
	json (COALESCE(sentryReplayOnErrorSampleRate, 100))
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'sentryMaxReplayDuration',
	json (COALESCE(sentryMaxReplayDuration, 60000))
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'sentryBlockAllMedia',
	json (
		CASE
			WHEN sentryBlockAllMedia = 1 THEN 'true'
			ELSE 'false'
		END
	)
FROM
	settings
WHERE
	rowid = 1;

INSERT INTO
	__new_settings (key, value)
SELECT
	'sentrySendDefaultPii',
	json (
		CASE
			WHEN sentrySendDefaultPii = 1 THEN 'true'
			ELSE 'false'
		END
	)
FROM
	settings
WHERE
	rowid = 1;

DROP TABLE settings;

ALTER TABLE __new_settings
RENAME TO settings;

PRAGMA foreign_keys = ON;