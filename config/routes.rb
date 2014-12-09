Shopper::Application.routes.draw do
  get "/api/auth/trello/callback" => 'sessions#create'
  # get "/api/memberauth/trello/callback" => 'sessions#create'
  post "/" => 'sessions#create'
  scope '/api' do
    resources :notes
    resources :board
    resources :list
    resources :card
    resources :sessions
    resources :grocer
    get "sessions/auth/trello" => redirect('/api/auth/trello')
    # get "sessions/auth/trello" => redirect('https://trello.com/1/authorize?response_type=token&key=d6fc7558d034e5cdfd387290f6f109e9&return_url=https://89bfe35.ngrok.com/api/memberauth/trello/callback&callback_method=postMessage&scope=read,write,account&expiration=1hour&name=Shopper')
    get "ping" => "application#ping"
  end
end
