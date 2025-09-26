from marshmallow import Schema, fields

class ServiceSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str(allow_none=True)
    amount = fields.Float(required=True)
    frequency = fields.Str()
    category = fields.Str()
    color = fields.Str()
    nextDueDate = fields.DateTime(attribute="next_due_date")  # maps camelCase <-> snake_case
    householdId = fields.Int(attribute="household_id")
    userId = fields.Int(attribute="user_id")
