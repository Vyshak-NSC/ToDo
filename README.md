# Flask Todo website

A simple RESTful ToDo website built with Flask,SQLAlchemy and Marshmallow.

## Features

- Add, view, update and delete tasks
- Real time updates
- JSON based responses
- List all or selected task (API only)
- Toggle task status

## Dependencies

- Python 3.12.4
- Flask 3.1.1
- Flask-SQLAlchemy 3.1.1
- Flask-Migrate 4.1.0
- SQLAlchemy 2.0.41
- SQLite
- Marshmallow 4.0.0
- Flask-SocketIO
- eventlet

## Project Structure
```
TODO/
├── app/
│   ├── __init__.py
│   ├── api.py
│   ├── models.py
│   ├── schemas.py
│   ├── extensions.py
│   ├── blueprints/
│   │   └── main/
│   │       ├── __init__.py
│   │       └── routes.py
│   ├── static/
│   │   ├── css/
│   │   │   └── styles.css
│   │   └── js/
│   │       └── scripts.js
│   └── templates/
│       └── index.html
├── migrations/
├── config.py
├── requirements.txt
├── run.py
└── README.md
```

## Installation

```bash
git clone https://github.com/Vyshak-NSC/ToDo.git
cd ToDo
pip install -r requirements.txt
```

## Initialise database

```bash
flask db init
flask db migrate -m "Initiall migration"
flask db upgrade
```

## Running the Website

#### 1. Direct Python Run with WebSocket Support:
- Enables Flask-SocketIO for real time data updates.
- Slower reloads.
- Set `debug=True` in `socketio.run()` inside `run.py` to enable live reloads.

Set up virtual env for project isolation (Optional).
```
python -m venv venv
venv/scripts/activate
```
Run:
```
python run.py

```
#### 2. Using Flask CLI:
- To run withou real time update for development.
- Provides faster reloads.

Create `.env` file in root folder with following:

```markdown
FLASK_APP=run.py
FLASK_ENV=development
DATABASE_URL=sqlite:///todo.db
SECRET_KEY=your-secret-key
```

Then run:
```bash
flask run
```

Run with `--debug` arg for live reloads.

## API Endpoints

| Method | Endpoint               | Description              | Request Body       |
|--------|------------------------|--------------------------|--------------------|
| GET    | `/ping`               | Get ping                 | –                  |
| GET    | `/todos`              | Get all todos            | –                  |
| GET    | `/todos/<id>`         | Get a single todo        | –                  |
| POST   | `/todos`              | Create a new todo        | `{ "title": "...", "content": "..." }` |
| PATCH  | `/todos/<id>`         | Update a todo            | Partial or full todo fields |
| PATCH  | `/todos/<id>/toggle`  | Toggle todo status       | –                  |
| DELETE | `/todos/<id>`         | Delete a todo            | –                  |

## Author

**Vyshak**
- Github - [Vyshak-NSC](https://github.com/Vyshak-NSC)
- Email - [vyshaknsc02@gmail.com](mailto:vyshaknsc02@gmail.com)