from marshmallow import Schema, fields, validate

class ExpenseSchema(Schema):
    id = fields.Int(dump_only=True)
    amount = fields.Float(required=True, validate=validate.Range(min=0.0))
    description = fields.Str(required=True)
    source = fields.Str(required=True, validate=validate.OneOf(['manual','mpesa','bank']))
    timestamp = fields.DateTime(required=True)
    user_id = fields.Int(required=True)
    household_id = fields.Int(required=True)
    category_id = fields.Int(allow_none=True)