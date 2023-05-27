import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client
from faker import Faker
import random

def add_entries_to_split_payments_table(supabase, split_payment_count, client_ids, final_user_ids):
    fake = Faker()
    main_list = []
    for _ in range(split_payment_count):
        value = {
        'split_payment_id': fake.uuid4(),
        'original_amount': fake.random_int(100, 1000),
        'interest_rate': random.uniform(0.01, 0.2),
        'due_date': str(fake.date_between(start_date='+1d', end_date='+30d')),
        'status': random.choice(['pending', 'paid', 'overdue']),
        'payment_method': random.choice(['Pix', 'Credit Card', 'Bank Transfer']),
        'final_user_id': random.choice(final_user_ids),
        'client_id': random.choice(client_ids),
        'created_at': str(fake.date_time_this_year()),
        }
        value['total_amount'] = value['original_amount'] * (1 + value['interest_rate'])
        main_list.append(value)
    supabase.table('SplitPayments').insert(main_list).execute()
    return [x['split_payment_id'] for x in main_list]

def add_entries_to_payment_transactions_table(supabase, payment_transaction_count, split_payment_ids, client_ids, final_user_ids):
    fake = Faker()
    main_list = []
    for _ in range(payment_transaction_count):
        value = {
        'transaction_id': fake.uuid4(),
        'split_payment_id': random.choice(split_payment_ids),
        'amount': fake.random_int(10, 100),
        'status': random.choice(['processing', 'completed', 'failed']),
        'transaction_date': str(fake.date_time_this_year()),
        'payment_method': random.choice(['Pix', 'Credit Card', 'Bank Transfer']),
        'client_id': random.choice(client_ids),
        'final_user_id': random.choice(final_user_ids),
        'type': random.choice(['down_payment', 'split_portion']),
        'due_date': str(fake.date_between(start_date='+1d', end_date='+30d')),
        'qr_code_copy': fake.lexify(text='??????'),
        'qt_code_img_link': fake.image_url(width=200, height=200),
        'stark_uuid': fake.uuid4(),
        }
        main_list.append(value)
    supabase.table('PaymentsTransactions').insert(main_list).execute()

def add_entries_to_clients_table(supabase, client_count):
    fake = Faker()
    main_list = []
    for _ in range(client_count):
        value = {
        'client_id': fake.uuid4(),
        'name': fake.name(),
        'email': fake.email(),
        'role': random.choice(['admin', 'customer support']),
        'created_at': str(fake.date_time_this_year()),
        }
        main_list.append(value)
    supabase.table('Clients').insert(main_list).execute()
    return [x['client_id'] for x in main_list]

def add_entries_to_final_users_table(supabase, final_user_count, client_ids):
    fake = Faker()
    main_list = []
    for _ in range(final_user_count):
        value = {
        'final_user_id': fake.uuid4(),
        'name': fake.name(),
        'email': fake.email(),
        'final_user_document': fake.random_number(digits=8),
        'created_at': str(fake.date_time_this_year()),
        'client_id': random.choice(client_ids),
        }
        main_list.append(value)
    supabase.table('FinalUsers').insert(main_list).execute()
    return [x['final_user_id'] for x in main_list]

def main():
    split_payment_count = 600
    payment_transaction_count = 100
    client_count = 2
    final_user_count = 30
    load_dotenv()
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    supabase: Client = create_client(url, key)

    client_ids = add_entries_to_clients_table(supabase, client_count)
    final_user_ids = add_entries_to_final_users_table(supabase, final_user_count, client_ids)
    split_payment_ids = add_entries_to_split_payments_table(supabase, split_payment_count, client_ids, final_user_ids)
    add_entries_to_payment_transactions_table(supabase, payment_transaction_count, split_payment_ids, client_ids, final_user_ids)

main()