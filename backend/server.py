from flask import Flask, request, flash
import rpy2.robjects as robjects
import json
from werkzeug import Response, urls

#app = Flask(__name__, static_folder="../static/dist", template_folder="../static")
app = Flask(__name__)
app.secret_key = "super secret key"

jsonheaders = [('Content-Type', 'application/json;charset=utf-8'), ('Cache-Control', 'max-age=0,must-revalidate')] 

'''
@app.route("/")
def index():
	return render_template("index.html")
'''


robjects.r('''
	library(bnlearn)
	library(plyr)
	library(jsonlite)
        data(coronary)
        coronary_structure = hc(coronary)
        coronary_fitted = bn.fit(coronary_structure, coronary)
	''')

networks = ["coronary"]

@app.route("/api/inference/<network>", methods = ["GET", "POST"])
def inference(network):
	'''
	network specifies preloaded Network
	need a dir of preloaded n/ws
	Client specifies req json including samples and evidence
	Query string for number of samples
	'''	
	#print(network)
	if network not in networks:
		return retjson({"status": 0, "error": "Network not found"})
	#print(request.query_string)
	#print(urls.url_decode(request.query_string))
	req_body = request.get_json(silent = True)
        print(req_body)
	cond_prob_list = calculate_cond_prob(network, req_body['evidence'], req_body['factors'])	
	res = retjson({"status": 1, "data": cond_prob_list}) 
	'''
	Return should include {'factors':{'level1': probability, 'level2': probability}}
	Be aware of injections

	'''
	print res
	return res

def retjson(r):
	return Response(response=json.dumps(r), headers=jsonheaders)

def calculate_cond_prob(network, evidence, factors):
	evidence_string = " & ".join('`{}` == "{}"'.format(key, value) for key,value in evidence.iteritems())
	nodes_string = ", ".join('"{}"'.format(f) for f in factors) 
	command = 'dist = cpdist({}_fitted, nodes = c({}), evidence = ({}), debug = TRUE)'.format(network,nodes_string, evidence_string)
	robjects.r(command)
	robjects.r('df = as.data.frame(table(dist))')
	ret = {}	
	for i,f in enumerate(factors):
		command2 = 'frequency = toJSON(ddply(df, {}, summarize, freq = sum(Freq)))'.format(i+1)
		robjects.r(command2)
		L = json.loads(robjects.globalenv['frequency'][0])
 		#Cannot use f from factors since R changes the name(eg. M. Work -> M..Work)
		frequencies = [l['freq'] for l in L]
		probabilities = [float(x)/sum(frequencies) for x in frequencies]
		for l in L:
			del(l['freq'])
		#ret[f] = {'levels': [l.itervalues().next() for l in L], 'probability' : probabilities}
		levels = [l.itervalues().next() for l in L]
		ret[f] = dict(zip(levels,frequencies))

	return (ret)

if __name__ == "__main__":
	app.run()



''' Use cpdist
Validate data before it enters R code

'''








