export default {
  translation: {
    header: {
      brand: 'Hexlet Chat',
      exit: 'Выйти',
    },
    loginPage: {
      title: 'Войти',
      username: 'Ваш ник',
      password: 'Пароль',
      login: 'Войти',
      noAccount: 'Нет аккаунта?',
      signup: 'Регистрация',
      error: 'Неверные имя пользователя или пароль',
    },
    signupPage: {
      title: 'Регистрация',
      username: 'Имя пользователя',
      password: 'Пароль',
      passwordConfirmation: 'Подтвердите пароль',
      signup: 'Зарегистрироваться',
      hasAccount: 'Уже есть аккаунт?',
      login: 'Войти',
      validation: {
        usernameLength: 'От 3 до 20 символов',
        passwordMin: 'Не менее 6 символов',
        passwordsMatch: 'Пароли должны совпадать',
        required: 'Обязательное поле',
      },
      errors: {
        userExists: 'Такой пользователь уже существует',
        registrationError: 'Ошибка регистрации',
      },
    },
    channels: {
      title: 'Каналы',
      noChannels: 'Нет каналов',
      add: 'Добавить канал',
      remove: 'Удалить канал',
      rename: 'Переименовать',
      name: 'Имя канала',
      manage: 'Управление каналом',
      removeConfirm: 'Вы уверены, что хотите удалить канал «{{name}}» и все его сообщения?',
      validation: {
        minLength: 'Минимум 3 символа',
        maxLength: 'Максимум 20 символов',
        required: 'Обязательное поле',
        duplicate: 'Канал с таким именем уже существует',
      },
      errors: {
        create: 'Ошибка создания канала',
        rename: 'Ошибка переименования канала',
      },
    },
    modals: {
      cancel: 'Отмена',
      send: 'Отправить',
      save: 'Сохранить',
      remove: 'Удалить',
    },
    messages: {
      placeholder: 'Введите сообщение...',
      send: 'Отправить',
      newMessage: 'Новое сообщение',
    },
    notFound: {
      title: 'Пейдж нот фаунд, его украли инопланетяне!',
    },
    toast: {
      channelCreated: 'Канал создан',
      channelRenamed: 'Канал переименован',
      channelRemoved: 'Канал удалён',
      networkError: 'Ошибка соединения',
      dataLoadError: 'Ошибка при загрузке данных',
    },
  },
};