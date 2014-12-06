Shopper::Application.routes.draw do
  
  # get "api/ping" => "application#pinga"
  scope '/api' do
    resources :notes
  end
end
