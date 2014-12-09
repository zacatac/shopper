class Card < ActiveRecord::Base
  # Checklist method already supplied, but may be useful for other options 
  # not included in the ruby-trello API wrapper
  # def self.get_card_checklists(id)
  #   path = :card
  #   Trello::client.get("/#{path.to_s.pluralize}/#{id}?checklists=all")
  # end
end
