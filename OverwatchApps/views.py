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
    day_data = json.dumps(pytrend.interest_over_time().to_json())

    pytrend.build_payload(kw_list=['bitcoin', 'ethereum', 'litecoin'], timeframe='now 7-d')
    week_data = json.dumps(pytrend.interest_over_time().to_json())

    pytrend.build_payload(kw_list=['bitcoin', 'ethereum', 'litecoin'], timeframe='today 1-m')
    month_data = json.dumps(pytrend.interest_over_time().to_json())

    return render(request, "home.html", {'mainCoinDataDay': day_data, 'mainCoinDataWeek': week_data, 'mainCoinDataMonth': month_data})
