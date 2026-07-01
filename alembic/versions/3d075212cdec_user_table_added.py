"""user table added

Revision ID: 3d075212cdec
Revises: db591b95ad5d
Create Date: 2026-07-01 14:51:59.594535

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3d075212cdec'
down_revision: Union[str, Sequence[str], None] = 'db591b95ad5d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)



def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
