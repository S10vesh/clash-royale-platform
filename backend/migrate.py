from database import engine
from sqlalchemy import text

# Добавляем колонку country_code в таблицу users
with engine.connect() as conn:
    conn.execute(text("ALTER TABLE users ADD COLUMN country_code VARCHAR(2)"))
    conn.commit()
    print("✅ Колонка country_code добавлена!")