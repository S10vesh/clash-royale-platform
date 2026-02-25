# 🔧 Установка бэкенда

## 1. Создать виртуальное окружение
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows

установи фреймворки они все в реквайрментс
pip install -r requirements.txt

запустить сервер
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

бекэнд сайт чтоб проверять все
http://localhost:8000/docs

удалить старый venv в cd backend
Remove-Item -Recurse -Force venv

удалить старый pycache в cd backend