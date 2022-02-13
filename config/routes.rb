Rails.application.routes.draw do
  resources :posts
  resources :code_blocks, param: :sgid, only: %i[create update]
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
