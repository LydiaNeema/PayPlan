from marshmallow import Schema, fields

class PaymentHistorySchema(Schema):
    id = fields.Int(dump_only=True)
    amount = fields.Float(required=True)
    date = fields.DateTime(required=True)
    service_id = fields.Int(required=True)
    user_id = fields.Int(required=True)
