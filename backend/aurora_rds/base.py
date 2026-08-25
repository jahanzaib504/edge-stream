import boto3
from django.db.backends.postgresql import base
class DatabaseWrapper(base.DatabaseWrapper):
    def get_new_connection(self, conn_params):
        # 1. Initialize the Boto3 RDS client
        # (It automatically uses IAM role credentials if deployed on EC2/ECS/EKS)
        auth_token = boto3.client('rds', region_name='ap-southeast-1').generate_db_auth_token(DBHostname='database-1.cluster-craqk6g2qubg.ap-southeast-1.rds.amazonaws.com', Port=5432, DBUsername='postgres', Region='ap-southeast-1')
        
        # 3. Inject the live token as the password
        conn_params['password'] = auth_token
        
        # 4. Hand off parameter handling to the default Django Postgres wrapper
        return super().get_new_connection(conn_params)
