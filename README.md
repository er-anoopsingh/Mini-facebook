## Welcome to Mini Facebook

### What is it:
A bootstrap and jquery based website where user can enter his/her access token and see their basic profile information and posts from their feed.

### What is access token:
It's a key which facebook generates and provides to users for limited time so that their API's can be accessed.

### How it works:
1. Two requests are made to facebook api when user submits access token:<br />
  1st : "https://graph.facebook.com/me?access_token=" which contains user information.<br />
  2nd : "https://graph.facebook.com/me/feed?access_token=" which contains posts from user feed.<br />

2. On successful requests 2 function calls are made:<br />
  1st :   showMyProfile(response) which is to display user profile information.<br />
  2nd : 	showMyFeed(response) which is to display user posts.<br />

### How to interact with website:
a.) Submitting your access token:<br />
  1. When you visit the website you will be promted for access token here's how you can get it:<br />
    1. Go to https://developers.facebook.com/tools/explorer/.<br />
    2. Login if not logged in already.<br />
    3. Beside "Access Token" field there is a "get Token" button click it.<br />
    4. Then click "get user access token" link.<br />
    5. Select what all permissions you want to give and click "Get Access Token" button.<br />
    6. Your access token will be displayed in "access token" field.<br />
    7. Copy the token, then come back to our website.<br />
    8. Simply paste the copied token and click on Go.<br />
    9. And your profile is live.<br />

    *you can also click "provide access token" button and repeat 8,9 step.*

b.)After successful submission:<br />
  1. You will see your basic info and top 5 posts from your feed.<br />
  2. To see more posts you can click Load more button and it will load next 5 posts.<br />

### Common errors:
1. If error "Please enter a valid token" is displayed then re-check your access token it may have expired, don't worry.<br />
2. You can again follow the (a) steps to generate new token.<br />

    *also make sure you are logged in this whole time to your facebook account or else token will be invalid.*

### GitHub:
1. You can visit the live website at https://er-anoopsingh.github.io/Mini-facebook<br />
2. You can view the source code at https://github.com/er-anoopsingh/Mini-facebook.
