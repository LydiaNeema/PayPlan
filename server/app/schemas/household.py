from marshmallow import Schema, fields

class HouseholdSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
