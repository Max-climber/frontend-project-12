import filter from 'leo-profanity'

const englishWords = filter.list()

// Загружаем русский словарь (заменяет английский)
filter.loadDictionary('ru')

// Объединяем оба словаря
filter.add(englishWords)

export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') {
    return text
  }
  return filter.clean(text)
}

export default filterProfanity
