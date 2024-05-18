from http.client import HTTPException
from typing import Optional

from fastapi import FastAPI
from recommendationEngine import recommendationEngine
from pydantic import BaseModel




######################################
class InputPayload(BaseModel):
    freelancer_id: int
    top_n: int

app = FastAPI()

######################################
# Assessment Endpoint
######################################

##############
## Smoke Test
##############
@app.get("/")
def work():
    return "ing"

##################
## Fetch Gig Data
##################

class ClientModel(BaseModel):
    client_id: str = None  # Make client_id optional
    client_name: str
    email: str
    phone: Optional[str]
    address: Optional[str]
    city: str
    country: str

@app.post("/create_client")
def create_client(client: ClientModel):
    params = {
        'db': 'tugela',
        'db_file': 'tugela.db',
        'freelancer_table': 'freelancers',
        'clients_table': 'clients',
        'gigs_table': 'gigs',
        'freelancer_id': '',
        'create_database': False,
        'insert_data': False,
        'perform_assessment': True,
        'top_n': '',
    }

    RE = recommendationEngine()
    RE.connect(params)
    # Ensure the clients table exists before inserting a new client
    table_result = RE.insert_client_data(params,  client.dict())
    RE.close()
    return {"gig_data" : table_result}


@app.get("/fetch_gigs/{gigs_table}")
def fetch_gigs(gigs_table: str):
    params = {
                'db'                   : 'tugela',
                'db_file'              : 'tugela.db',
                'freelancer_table'     : 'freelancers',
                'clients_table'        : 'clients',
                'gigs_table'           : gigs_table,
                'freelancer_id'        : '',
                'create_database'      : False,
                'insert_data'          : False,
                'perform_assessment'   : True,
                'top_n'                : '',
    }
    
    RE = recommendationEngine()    
    RE.connect(params)
    gig_data = RE.fetch_gig_data(params)
    RE.close()
    
    return {"gig_data" : gig_data}


########################
## Assessment & Scoring
########################
@app.get("/perform_assessment/{gigs_table}")
def perform_assessment(msg:InputPayload, gigs_table: str):
    params = {
                'db'                   : 'tugela',
                'db_file'              : 'tugela.db',
                'freelancer_table'     : 'freelancers',
                'clients_table'        : 'clients',
                'gigs_table'           : gigs_table,
                'freelancer_id'        : msg.freelancer_id,
                'create_database'      : False,
                'insert_data'          : False,
                'perform_assessment'   : True,
                'top_n'                : int(msg.top_n),
    }
    
    RE = recommendationEngine()    
    RE.connect(params)
    
    freelancer_data = RE.fetch_freelancer_data(params)
    gig_data = RE.fetch_gig_data(params)
    
    df_freelancer = RE.create_dataframe(freelancer_data, _type='freelancer')
    df_gigs = RE.create_dataframe(gig_data, _type='gigs')
    
    message = RE.construct_assessment(df_freelancer, df_gigs)
    output_msg = RE.recruitment_analysis(message)
    top_gigs   = RE.sort_job_requests(output_msg, params)
    RE.close()
    
    return {"top_gigs": top_gigs}

