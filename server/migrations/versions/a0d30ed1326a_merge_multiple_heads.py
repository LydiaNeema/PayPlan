"""Merge multiple heads

Revision ID: a0d30ed1326a
Revises: e0cfa2c6b204, fa377ff1d863
Create Date: 2025-09-24 21:57:54.189484

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a0d30ed1326a'
down_revision = ('e0cfa2c6b204', 'fa377ff1d863')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
