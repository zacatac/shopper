Rails.application.config.middleware.use OmniAuth::Builder do
  provider :trello, Rails.application.config.trello_api_key, Rails.application.config.trello_api_secret,
  app_name: "Shopper", scope: 'read,write,account', expiration: '1hour', path_prefix: '/api/auth'
  # provider :trello, ENV['TRELLO_KEY'], ENV['TRELLO_SECRET'],
  # app_name: "APP_NAME", scope: 'read,write,account', expiration: 'never'
end
