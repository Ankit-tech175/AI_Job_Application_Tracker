from datetime import datetime

from backend.database.extensions import db


class JobApplication(db.Model):

    __tablename__ = "job_applications"

    id = db.Column(db.Integer, primary_key=True)

    company_name = db.Column(
        db.String(150),
        nullable=False
    )

    job_title = db.Column(
        db.String(150),
        nullable=False
    )

    job_link = db.Column(
        db.String(500),
        nullable=True
    )

    status = db.Column(
        db.String(50),
        default="Applied"
    )

    notes = db.Column(
        db.Text,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # Foreign Key Relationship
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    def __repr__(self):

        return f"<JobApplication {self.company_name}>"