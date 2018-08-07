import requests
import json

evidence = {"P. Work":"yes", "Pressure": ">140"}
factors = ["Smoking","Family","M. Work","Proteins"]
body = {'evidence': evidence, 'factors': factors}
res = requests.post("http://localhost:5000/api/inference/coronary", json = body)
if res.ok:
	print(json.dumps(res.json(), indent = 2))
else:
	print(res)

