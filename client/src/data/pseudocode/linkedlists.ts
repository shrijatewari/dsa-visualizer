export const insertAtBeginningPseudo = [
  'function insertAtBeginning(value):',
  '  newNode = createNode(value)',
  '  newNode.next = head',
  '  head = newNode',
  '  if tail is null:',
  '    tail = head'
]

export const insertAtEndPseudo = [
  'function insertAtEnd(value):',
  '  newNode = createNode(value)',
  '  if head is null:',
  '    head = newNode',
  '    tail = newNode',
  '  else:',
  '    tail.next = newNode',
  '    tail = newNode'
]

export const insertAtPositionPseudo = [
  'function insertAtPosition(value, position):',
  '  if position == 0:',
  '    insertAtBeginning(value)',
  '    return',
  '  current = head',
  '  for i = 0 to position - 1:',
  '    if current is null:',
  '      return error',
  '    current = current.next',
  '  newNode = createNode(value)',
  '  newNode.next = current.next',
  '  current.next = newNode'
]

export const deleteAtBeginningPseudo = [
  'function deleteAtBeginning():',
  '  if head is null:',
  '    return error',
  '  temp = head',
  '  head = head.next',
  '  if head is null:',
  '    tail = null',
  '  delete temp'
]

export const deleteAtEndPseudo = [
  'function deleteAtEnd():',
  '  if head is null:',
  '    return error',
  '  if head == tail:',
  '    delete head',
  '    head = tail = null',
  '    return',
  '  current = head',
  '  while current.next != tail:',
  '    current = current.next',
  '  delete tail',
  '  tail = current',
  '  tail.next = null'
]

export const deleteAtPositionPseudo = [
  'function deleteAtPosition(position):',
  '  if position == 0:',
  '    deleteAtBeginning()',
  '    return',
  '  current = head',
  '  for i = 0 to position - 1:',
  '    if current is null:',
  '      return error',
  '    current = current.next',
  '  if current.next is null:',
  '    return error',
  '  temp = current.next',
  '  current.next = current.next.next',
  '  delete temp'
]

export const searchPseudo = [
  'function search(value):',
  '  current = head',
  '  index = 0',
  '  while current is not null:',
  '    if current.value == value:',
  '      return index',
  '    current = current.next',
  '    index = index + 1',
  '  return -1'
]

export const reverseIterativePseudo = [
  'function reverseIterative():',
  '  prev = null',
  '  current = head',
  '  next = null',
  '  while current is not null:',
  '    next = current.next',
  '    current.next = prev',
  '    prev = current',
  '    current = next',
  '  head = prev'
]

export const reverseRecursivePseudo = [
  'function reverseRecursive(node):',
  '  if node is null or node.next is null:',
  '    return node',
  '  rest = reverseRecursive(node.next)',
  '  node.next.next = node',
  '  node.next = null',
  '  return rest'
]

export const detectCyclePseudo = [
  'function detectCycle():',
  '  slow = head',
  '  fast = head',
  '  while fast is not null and fast.next is not null:',
  '    slow = slow.next',
  '    fast = fast.next.next',
  '    if slow == fast:',
  '      return true',
  '  return false'
]

export const removeCyclePseudo = [
  'function removeCycle():',
  '  slow = head',
  '  fast = head',
  '  while fast is not null and fast.next is not null:',
  '    slow = slow.next',
  '    fast = fast.next.next',
  '    if slow == fast:',
  '      break',
  '  if fast is null or fast.next is null:',
  '    return',
  '  slow = head',
  '  while slow.next != fast.next:',
  '    slow = slow.next',
  '    fast = fast.next',
  '  fast.next = null'
]

export const clearPseudo = [
  'function clear():',
  '  current = head',
  '  while current is not null:',
  '    temp = current',
  '    current = current.next',
  '    delete temp',
  '  head = null',
  '  tail = null'
]



