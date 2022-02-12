Rails.application.routes.draw do
  resources :posts
  resources :code_blocks, only: :create
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
