from marshmallow import Schema, fields

class PaymentHistorySchema(Schema):
    id = fields.Int(dump_only=True)
    amount = fields.Float(required=True)
    due_date = fields.Date(required=True, data_key="dueDate")
    paid = fields.Bool()
    service_id = fields.Int(required=False, allow_none=True)
    user_id = fields.Int(required=True)
    manual_name = fields.Str(required=False, allow_none=True)
    category = fields.Str(required=False, allow_none=True)
    color = fields.Str(required=False, allow_none=True)
