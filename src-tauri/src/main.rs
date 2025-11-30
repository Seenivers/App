// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::LevelFilter;
use sentry::ClientInitGuard;
use sentry_log::SentryLogger;

fn main() {
    let _sentry: ClientInitGuard = sentry::init((
        "https://17b503b446664415a4c43e1619aa1cdf@glitchtip.webretter.com/7",
        sentry::ClientOptions {
            release: Some("seenivers@1.0.0".into()), // Version deiner App
            environment: Some(
                if cfg!(debug_assertions) {
                    "development"
                } else {
                    "production"
                }
                .into(),
            ),
            ..Default::default()
        },
    ));

    let logger = SentryLogger::with_dest(log::logger());
    log::set_boxed_logger(Box::new(logger)).unwrap();
    log::set_max_level(LevelFilter::Error);

    seenivers_lib::run();
}
