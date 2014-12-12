# Shopper

A grocery shopping application that streamlines the process between deciding which recipes you want to make and having the ingredients necessary in your kitchen.

Built on [AngularJS](http://angularjs.org) and [Rails](http://rubyonrails.org/). Project layout pulled from [Emmanuel Oga's repo](https://github.com/EmmanuelOga/simple-angular-rails-app/)

[Live demo](http://shopp.herokuapp.com/#/)

Github [repository](https://github.com/zacatac/shopper/)

While it is possible to include AngularJS as part of the rails assets, I
think it is better to setup the angular code base <strong>on a
standalone folder</strong>, leaving the rails app as a (more or less)
isolated backend.

Look [here](https://github.com/EmmanuelOga/simple-angular-rails-app/) for the advantages to this setup.

## Setting the environment up

You'll need:

* ruby 2.0.x ([rvm](https://rvm.io/))
* node 0.10.29+ ([brew](http://brew.sh/))
* Two shell sessions!

### Session one: the rails backend:

```
git clone git@github.com:zacatac/shopper.git
cd shopper
bundle install
bundle exec rails s -p 3000
```

### Session two: a grunt server

```
cd shopper/ngapp
npm install -g grunt-cli
npm install
bower install
grunt server # opens a browser window... you are done!
```

For more info checkout the readme in [this repo](https://github.com/EmmanuelOga/simple-angular-rails-app/)

## Testing

To run both the backend tests and front end tests, you can run:
* Note: Much of the functionality of the app has yet to be tested.

```
rake test PHANTOMJS_BIN=`which phantomjs`
```

This is done by [reopening rails's test
task](https://github.com/EmmanuelOga/simple-angular-rails-app/blob/master/Rakefile#L8-L10)
and adding a step to run the karma runner. This design is a bit
simplistic but it works. You may want to have something a bit more
elaborate to make it so angular's tests are run even if rails tests fail
to complete.

The PHANTOMJS_BIN env var is needed because the project configures karma
to use [phantom js](http://www.phantomjs.org), but it could be changed
to run any other browser.

karma can be
[configured](https://github.com/EmmanuelOga/simple-angular-rails-app/blob/master/ngapp/karma.conf.js#L40)
to watch the tests as opposed to do a single run. You should
deffinitively look into that during development.

## Deploying

I deployed the application on heroku, so I will give directions detailing that process.
The repository already has the buildpacks, and grunt tasks necessary to get the app running
on heroku. The only task left is to get heroku to build properly.
1. Set configuration variables:
   * heroku config:set SECRET_KEY_BASE=replacethiswithyourapplicationssecretkey
   * heroku config:set TRELLO_API_KEY=replacethiswithyourtrelloapikey
   * heroku config:set TRELLO_API_SECRET=replacethiswithyourtrelloapisecret
   * heroku config:set SAFEWAY_EMAIL=replacethiswithyoursafewayaccountemail
   * heroku config:set SAFEWAY_PASS=replacethiswithyoursafewayaccountpassword
2. Define multibuild pack build type:
   * heroku config:set BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi.git
3. Deploy! 
   * git push heroku master

The grunt task `build` will package the whole angular app in a
tidy package on the rails public/ folder. This packaging step
happens in the server to avoid having to commit the generated assets in
your repository, analogous to how it is done for generating assets with
rails' assets pipeline.

## XSRF support

The rails app sets the XSRF token in the cookies. The cookies are
accessible even when using the proxy because the port is [not taken into
account](http://stackoverflow.com/questions/1612177/are-http-cookies-port-specific)
when restricting access to the cookies.

Check
[StackOverflow](http://stackoverflow.com/questions/14734243/rails-csrf-protection-angular-js-protect-from-forgery-makes-me-to-log-out-on)
for some notes on the XSRF protection.

http://bootsnipp.com/snippets/featured/accordion-list-group-menu
https://www.twilio.com/blog/2014/09/gmail-api-oauth-rails.html