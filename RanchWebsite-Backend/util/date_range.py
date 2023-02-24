from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

class DateRange():
   date_range_string = None
   start_datetime = None
   end_datetime = None
   timezone = 'America/Denver'

   def __init__(self, date_range_string):
      self.date_range_string = date_range_string
   
   def calc_today(self):
      self.start_datetime = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) # Today at Midnight (Beginning of the day)
      self.end_datetime = self.start_datetime + timedelta(days=1) # Tomorrow at midnight
      self.end_datetime = self.end_datetime - timedelta(microseconds=1) # Back up to tonight at 23:59:59.999999
   
   def calc_yesterday(self):
      date_obj = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
      self.start_datetime = date_obj - timedelta(days=1)  # Yesterday at midnight (Beginning of day)
      self.end_datetime = self.start_datetime + timedelta(days=1) # Today at midnight
      self.end_datetime = self.end_datetime - timedelta(microseconds=1) # Back up to yesterday at 23:59:59.999999
   
   def calc_last_week(self):
      date_obj = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
      self.start_datetime = date_obj - timedelta(days=(date_obj.weekday() + 8))  # Sunday (one week ago)
      self.end_datetime = self.start_datetime + timedelta(days=7) # Next Sunday
      self.end_datetime = self.end_datetime - timedelta(microseconds=1) # Back up to Saturday Night at 23:59:59.999999
   
   def calc_this_week(self):
      # Get today at midnight (beginning of the day)
      date_obj = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
      self.start_datetime = date_obj - timedelta(days=(date_obj.weekday() + 1))  # Sunday
      self.end_datetime = self.start_datetime + timedelta(days=7) # Next Sunday
      self.end_datetime = self.end_datetime - timedelta(microseconds=1) # Back up to Saturday Night at 23:59:59.999999
      
   def calc_last_month(self):
      # Get first of month at midnight (beginning of the day)
      self.start_datetime = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
      self.start_datetime = self.start_datetime - relativedelta(months=1)
      self.end_datetime = self.start_datetime + relativedelta(months=1)
      self.end_datetime = self.end_datetime - timedelta(microseconds=1) # Back up to Saturday Night at 23:59:59.999999
   
   def calc_this_month(self):
      # Get first of month at midnight (beginning of the day)
      self.start_datetime = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
      self.end_datetime = self.start_datetime + relativedelta(months=1)
      self.end_datetime = self.end_datetime - timedelta(microseconds=1) # Back up to Saturday Night at 23:59:59.999999
   
   def calc_last_quarter(self):
      self.start_datetime = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
      current_quarter = (self.start_datetime.month - 1) // 3 + 1
      start_month = current_quarter * 3 - 2
      self.start_datetime = self.start_datetime.replace(month=start_month) - relativedelta(months=3)
      self.end_datetime = self.start_datetime + relativedelta(months=3)
      self.end_datetime = self.end_datetime - timedelta(microseconds=1)

   def calc_this_quarter(self):
      self.start_datetime = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
      current_quarter = (self.start_datetime.month - 1) // 3 + 1
      start_month = current_quarter * 3 - 2
      self.start_datetime = self.start_datetime.replace(month=start_month)
      self.end_datetime = self.start_datetime + relativedelta(months=3)
      self.end_datetime = self.end_datetime - timedelta(microseconds=1)

   def calc_last_year(self):
      # Get first of year at midnight
      self.start_datetime = datetime.now().replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
      self.start_datetime = self.start_datetime - relativedelta(years=1)
      self.end_datetime = self.start_datetime + relativedelta(years=1)
      self.end_datetime = self.end_datetime - timedelta(microseconds=1) # Back up to the last day of the year Dec 31 at 23:59:59.999999

   def calc_this_year(self):
      # Get first of year at midnight
      self.start_datetime = datetime.now().replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
      self.end_datetime = self.start_datetime + relativedelta(years=1)
      self.end_datetime = self.end_datetime - timedelta(microseconds=1) # Back up to the last day of the year Dec 31 at 23:59:59.999999

   def calc_since(self):
      self.end_datetime = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
      self.end_datetime = self.end_datetime + timedelta(days=1)
      self.end_datetime = self.end_datetime - timedelta(microseconds=1) # Back up to the end of today at 23:59:59.999999

   def calc_last_seven_days(self):
      # Get first of year at midnight
      self.start_datetime = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
      self.end_datetime = self.start_datetime + timedelta(days=1)
      self.start_datetime = self.start_datetime - timedelta(days=6)
      self.end_datetime = self.end_datetime - timedelta(microseconds=1) # Back up to the end of today at 23:59:59.999999

   function_map = {
      'TODAY': calc_today,
      'YESTERDAY': calc_yesterday,
      'LAST_WEEK': calc_last_week,
      'THIS_WEEK': calc_this_week,
      'LAST_MONTH': calc_last_month,
      'THIS_MONTH': calc_this_month,
      'LAST_QUARTER': calc_last_quarter,
      'THIS_QUARTER': calc_this_quarter,
      'LAST_YEAR': calc_last_year,
      'THIS_YEAR': calc_this_year,
      'SINCE': calc_since,
      'LAST_SEVEN_DAYS': calc_last_seven_days
   }

   def calculate(self):
      if self.date_range_string == None:
         return False
      
      self.function_map[self.date_range_string.upper()](self)
      return True

# dr = DateRange('LAST_QUARTER')
# # dr.start_datetime = datetime(2020, 8, 17, 12, 5, 13, 654321)
# dr.calculate()
# print(dr.start_datetime)
# print(dr.end_datetime)