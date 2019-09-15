from collections import OrderedDict

class Dictlist(OrderedDict):
  def __setitem__(self, key, value):
    try:
      self[key]
    except KeyError:
      super(Dictlist, self).__setitem__(key, [])
    self[key].append(value)