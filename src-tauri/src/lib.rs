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
        .plugin(tauri_plugin_os::init())
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
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
