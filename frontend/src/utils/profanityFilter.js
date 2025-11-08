import filter from 'leo-profanity'

// По умолчанию leo-profanity использует английский словарь
// Сохраняем английские слова перед загрузкой русского словаря
const englishWords = filter.list()

// Загружаем русский словарь (заменяет английский)
filter.loadDictionary('ru')

// Объединяем оба словаря: добавляем английские слова к русскому словарю
filter.add(englishWords)

/**
 * Фильтрует нецензурные слова в тексте, заменяя их на звездочки
 * Поддерживает английский и русский языки
 * @param {string} text - Текст для фильтрации
 * @returns {string} - Отфильтрованный текст
 */
export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') {
    return text
  }
  return filter.clean(text)
}

export default filterProfanity
