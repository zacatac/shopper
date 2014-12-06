Shopper::Application.routes.draw do
  
  scope '/api' do
    resources :notes
    resources :board
    get "ping" => "application#ping"
  end
end
