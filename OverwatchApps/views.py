from oauth2_provider.views.generic import ProtectedResourceView
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
import datetime, pytz, requests
from pytrends.request import TrendReq
import json

def home(request):
    pytrend = TrendReq('pytrendstestbuster', 'pingdriver', hl='en-US', tz=360, custom_useragent=None)
    pytrend.build_payload(kw_list=['bitcoin', 'ethereum', 'litecoin'], timeframe='now 1-d')
    return render(request, "home.html", {'mainCoinData': json.dumps(pytrend.interest_over_time().to_json())})
