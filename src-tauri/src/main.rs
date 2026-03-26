// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::LevelFilter;
use sentry::ClientInitGuard;
use sentry_log::SentryLogger;

fn main() {
    let _sentry: ClientInitGuard = sentry::init((
        "https://31369000a8c24384bb298cd1efa37ea2@glitchtip.seenivers.com/2",
        sentry::ClientOptions {
            release: sentry::release_name!(),
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
    log::set_max_level(LevelFilter::Warn);

    seenivers_lib::run();
}
