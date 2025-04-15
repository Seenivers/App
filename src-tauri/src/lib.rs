mod migrations;

#[cfg_attr(mobile, tauri::mobile_entry_point)]

pub fn run() {
    // Migrations automatisch laden
    let migrations = migrations::load_migrations();

    // Abhängig vom Build-Typ den DB-Pfad setzen:
    let db_path = if cfg!(debug_assertions) {
        "sqlite:DEV-sqlite.db"
    } else {
        "sqlite:sqlite.db"
    };

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(db_path, migrations)
                .build(),
        )
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_drpc::init())
        // Für Desktop-Plattformen das tauri_plugin_updater-Plugin hinzufügen
        .setup(|_app| {
            #[cfg(desktop)]
            let _ = _app
                .handle()
                .plugin(tauri_plugin_updater::Builder::new().build());
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .timezone_strategy(tauri_plugin_log::TimezoneStrategy::UseLocal)
                .max_file_size((10 * 1024 * 1024) as u128) // 10MB
                .clear_targets()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Webview,
                ))
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::LogDir {
                        file_name: Some("logs".to_string()),
                    },
                ))
                .filter(|metadata| {
                    metadata.target() != "tao::platform_impl::platform::event_loop::runner"
                })
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
