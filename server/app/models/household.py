from app import db

class Household(db.Model):
    __tablename__ = "households"   

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # Relationships
    users = db.relationship("User", back_populates="household", cascade="all, delete-orphan")
    expenses = db.relationship("Expense", back_populates="household", cascade="all, delete-orphan")

    def to_dict(self, include_members=False):
        data = {
            "id": self.id,
            "name": self.name,
        }
        if include_members:
            data["members"] = [
                {
                    "id": u.id,
                    "username": u.username,
                    "email": u.email,
                    "role": u.role,
                }
                for u in self.users
            ]
        return data
