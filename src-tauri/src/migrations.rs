// src/migrations.rs
use include_dir::{include_dir, Dir};
use tauri_plugin_sql::{Migration, MigrationKind};

/// Bindet das Migrationsverzeichnis zur Compile-Zeit ein (relativer Pfad)
static MIGRATIONS_DIR: Dir = include_dir!("$CARGO_MANIFEST_DIR/migrations");

/// Lädt automatisch alle Migrationen aus dem angegebenen Ordner.
/// Erwartet Dateinamen im Format "0001_description.sql", wobei:
///   - Die ersten vier Zeichen (als Zahl) die Version darstellen,
///   - der Rest vor der Endung die Beschreibung liefert.
pub fn load_migrations() -> Vec<Migration> {
    let mut migrations: Vec<Migration> = MIGRATIONS_DIR
        .files()
        // Filtere nur die Dateien mit der Endung ".sql"
        .filter(|f| f.path().extension().and_then(|ext| ext.to_str()) == Some("sql"))
        .filter_map(|file| {
            // Hole den Dateinamen ohne Endung, z. B. "0001_thick_iron_man"
            let file_stem = file.path().file_stem()?.to_str()?;
            // Teile den Dateinamen in "Version" und "Description"
            let mut parts = file_stem.splitn(2, '_');
            let version_str = parts.next()?;
            let description = parts.next()?;
            // Parsen der Version als i64
            let version = version_str.parse::<i64>().ok()?;
            // Hole den SQL-Inhalt als &'static str
            let sql = file.contents_utf8()?;
            Some(Migration {
                version,
                description,
                sql,
                kind: MigrationKind::Up,
            })
        })
        .collect();

    // Sortiere die Migrationen nach Version
    migrations.sort_by_key(|m| m.version);
    migrations
}
