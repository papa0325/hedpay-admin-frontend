module.exports = {
  sidebar: {
    shortTitle: 'CT',
    dashboard: 'Dashboard',
    pages: 'Pages',
    pricing: 'Pricing',
    rtl: 'RTL Support',
    timeline: 'Timeline',
    login: 'Login',
    register: 'Register',
    lock: 'Lock Screen',
    userProfile: 'User Profile',
    components: 'Components',
    multiLevelCollapse: 'Multilevel Collapse',
    example: 'Example Page',
    buttons: 'Buttons',
    gridSystem: 'Grid System',
    panels: 'Panels',
    sweetAlert: 'Sweet Alert',
    icons: 'Icons',
    notifications: 'Notifications',
    typography: 'Typography',
    forms: 'Forms',
    regularForms: 'Regular Forms',
    extendedForms: 'Extended Forms',
    validationForms: 'Validation Forms',
    wizard: 'Wizard',
    tables: 'Tables',
    regularTables: 'Regular Tables',
    extendedTables: 'Extended Tables',
    paginatedTables: 'Paginated Tables',
    maps: 'Maps',
    googleMaps: 'Google Maps',
    fullScreenMaps: 'Full Screen Map',
    vectorMaps: 'Vector Maps',
    widgets: 'Widgets',
    charts: 'Charts',
    calendar: 'Calendar',
  },
  main: {
    usersCount: 'Зарегистрированные пользователи',
    usersCountText: 'Text',
    usersOnline: 'Пользователи в сети',
    usersOnlineText: 'Text',
    newUsers: 'Новые пользователи (за день)',
    newUsersText: 'Text',
    fee: 'Комиссия',
    feeText: 'Text',
    tradingVolume: 'Объем торгов',
    amountOfInsights: 'Объем выводов',
    volumeOfDeposits: 'Объем депозитов',
    nullData: 'Нет данных для данной пары',
    noDataCards: 'Нет данных',
    total: 'Объем',
    count: 'Количество',
  },
  error: {
    title: 'Ошибка',
    backToHome: 'Вернуться к дашборду',
    backToLogin: 'Вернуться к странице авторизации',
    serverError: 'Ошибка сервера',
  },
  newSidebar: {
    rus: 'Рус.',
    eng: 'Анг.',
    title: 'HedPay',
    shortTitle: 'НК',
    dashboard: 'Дашборд',
    logOut: 'Выйти',
    'exchange-settings': 'Настройки биржи',
    management: 'Менеджмент',
    'users-management': 'Менеджмент пользователей',
    'admins-management': 'Менеджмент администраторов',
    chat: 'Чат',
    'currency-management': 'Управление валютами',
    'currency-pairs-management': 'Управление валютными парами',
    'order-history': 'Ордера',
    markdown: '',
    'faq-editor': 'Редактор FAQ',
    transactions: 'Транзакции',
    deposit: 'Ввод',
    withdraw: 'Вывод',
    transfer: 'Переводы',
    statistics: 'Статистика',
    orders: 'Ордера',
    'user-info': 'О пользователе',
  },
  statistics: {
    title: 'Статистика',
    calculate: 'Применить',
    sell: 'Продано',
    sum: 'На сумму',
    middlePrice: 'Средняя цена',
    currency: 'Валюта',
    noData: 'Нет данных для выбранной даты',
  },
  currencyManagement: {
    title: 'Доступные валюты',
    currencyAddModal: {
      editTitle: 'Редактировать валюту',
      infoTitle: 'Настройки валюты:',
      title: 'Добавить валюту',
      fullName: 'Название',
      ticker: 'Тикер',
      priceStep: 'Шаг цены',
      minTransactionVolume: 'Мин. объем сделки',
      description: 'Описание',
      blockChain: 'Блокчейн',
      addButton: 'Добавить',
      editButton: 'Редактировать',
      closeButton: 'Закрыть',
      logoURL: 'Лого URL',
      type: 'Тип',
      address: 'Адрес',
      decimals: 'Разрядность',
      maxWithdraw: 'Макс. вывод',
      minWithdraw: 'Мин. вывод',
      withdrawCommissionFixed: 'Фикс. комиссия',
      withdrawCommissionPercentage: '% комиссия',
      completeDrop: 'Выберите пункты выпадающих списков',
    },
    withdrawalFeeModal: {
      title: 'Настройка комиссии за вывод',
      currencyName: 'Название валюты',
      commission: 'Комиссия',
    },
    addValue: 'Добавить значение',
  },
  currencyPairsManagement: {
    deleted: 'Удалено',
    updated: 'Обновлено',
    added: 'Добавлено',
    title: 'Валютные пары',
    addValue: 'Добавить значение',
    pairDisabled: 'Пара отключена',
    pairEnabled: 'Пара включена',
    currencyPairsAddModal: {
      tiker: 'Тикер',
      selectCurrencies: 'Выберите валюты',
      sameCurrencies: 'Вы выбрали одинаковые валюты',
      noFiat: 'Fiat не может быть первой валютой',
      title: 'Добавить валютную пару',
      infoTitle: 'Настройки валютной пары:',
      fullName: 'Название',
      description: 'Описание',
      pairId: 'Id пары',
      takerFee: 'Taker fee',
      makerFee: 'Maker fee',
      priceMin: 'Мин. цена',
      priceMax: 'Макс. цена',
      priceTick: 'Цена шага',
      lotSizeMin: 'Мин. разм. лота',
      lotSizeMax: 'Макс. разм. лота',
      lotSizeTick: 'Шаг разм. лота',
    },
    currencyPairsEdit: {
      title: 'Редактировать пару',
      takerFee: 'Taker fee',
      makerFee: 'Maker fee',
      priceMin: 'Мин. цена',
      priceMax: 'Макс. цена',
      priceTick: 'Цена шага',
      lotSizeMin: 'Мин. разм. лота',
      lotSizeMax: 'Макс. разм. лота',
      lotSizeTick: 'Шаг разм. лота',
    },
    // currencyPairsInfo: {
    //   fullName: 'Название',
    //   description: 'Описание',
    //   pairId: 'Id пары',
    //   takerFee: 'Taker fee',
    //   makerFee: 'Maker fee',
    //   priceMin: 'Мин. цена',
    //   priceMax: 'Макс. цена',
    //   priceTick: 'Цена шага',
    //   lotSizeMin: 'Мин. разм. лота',
    //   lotSizeMax: 'Макс. разм. лота',
    //   lotSizeTick: 'Шаг разм. лота',
    // },
    commissionModal: {
      titleFixFee: 'Фиксированная комиссия',
      titleDiscount: 'Размер скидки',
      currencyPair: 'Валютная пара',
      fix: {
        title: 'Фиксированная комиссия',
        makerFee: 'Создатель  комиссии',
        takerFee: 'Получатель комисии',
      },
      volume: {
        title: 'Комиссия от объема',
        from: 'От',
        to: 'До',
        commission: 'Комиссия',
        makerCommission: 'Создатель  комиссии',
        takerCommission: 'Получатель комиссии',
        bttBalance: 'Баланс BTT',
      },
      close: 'Закрыть',
      save: 'Сохранить',
      discount: 'Скидка',
    },
  },
  transactions: {
    title: 'Транзакции',
    copySuccess: 'Скопировано',
    table: {
      currency: 'Валюта',
      type: 'Тип',
      status: 'Статус',
      date: 'Дата',
      amount: 'Количество',
      reason: 'Причина',
      recipient: 'Получатель',
      failed: 'Провалено',
      confirmed: 'Подтверждено',
      created: 'Создано',
      error: 'Ошибка',
      rejected: 'Отклонено',
      pending: 'Ожидает',
    },
    selects: {
      withdraw: 'Вывод',
      deposit: 'Ввод',
      allTypes: 'Все типы',
      all: 'Все причины',
      trade: 'Трейд',
      p2p: 'P2P',
      reward: 'Награда',
      approving: 'Ожидают',
      pending: 'Ожидает',
      rejected: 'Отклонено',
      confirmed: 'Подтверждено',
    },
    modals: {
      null: 'Заполните все поля',
      confirm: 'Подтвердить',
      enterMessage: 'Введите сообщение',
      enterCode: 'Введите код',
      reject: 'Отклонить',
      approve: 'Одобрить',
    },
  },
  monitoring: {
    monitoring: '',
  },
  management: {
    completed: 'Завершено',
    addAdmin: 'Добавить администратора',
    addAdminModal: {
      title: 'Новый администратор',
      text: 'текст',
      options: {
        role: 'Роль',
        admin: 'Администратор',
        operator: 'Оператор',
        unconfirmed: 'Неподтвержден',
        super: 'Супер',
      },
      addButton: 'Добавить',
      successMessage: 'Письмо для регистрации отправлено администратору на email',
      nullRole: 'Выберите роль',
    },
    users: 'Пользователи',
    admins: 'Администраторы',
    search: 'Найти запись',
    table: {
      activity: 'Активность',
      block: 'Заблокировать',
      hold: 'Заморозить',
      unblock: 'Разблокировать',
      userInfo: 'О пользователе',
      verified: 'Подтвержденный',
      unverified: 'Неподтвержденный',
      status: 'Статус',
      email: 'Email',
      firstName: 'Имя',
      lastName: 'Фамилия',
      login: 'Имя пользователя',
      id: 'Id',
      phone: 'Телефон',
      country: 'Страна',
      active: 'Активный',
      banned: 'Заблокирован',
      allUsers: 'Все пользователи',
      blockedUsers: 'Заблокированные',
      activeUsers: 'Активные',
    },
    actions: {
      blocked: 'Пользователь заблокирован',
      unblocked: 'Пользователь разблокирован',
      roleChange: 'Роль изменена',
    },
    orderHistory: {
      successClose: 'Ордер закрыт',
      closeOrder: 'Отменить ордер',
      title: 'Ордера',
      pair: 'Валютная пара',
      allPairs: 'Все пары',
      side: 'Сторона',
      quantity: 'Сумма',
      executed: 'Выполнено',
      price: 'Цена',
      date: 'Дата',
      status: 'Статус',
      back: 'Назад',
      stats: {
        all: 'Все статусы',
        created: 'Создано',
        accepted: 'Принято',
        rejected: 'Отклонено',
        executing: 'Выполняется',
        executed: 'Выполнено',
        cancelled: 'Отменено',
      },
      sides: {
        all: 'Все стороны',
        buy: 'Покупка',
        sell: 'Продажа',
        buyShort: 'Покупка в шорт',
        sellShort: 'Продажа в шорт',
      },
    },
    roleError: 'У вас нет доступа к этой странице',
    'user-info': {
      userChat: 'Чат',
      general: {
        active: 'Активнен',
        blocked: 'Заблокирован',
        title: 'Общее',
        login: 'Логин',
        email: 'Почта',
        phone: 'Телефон',
        date: 'Дата регистрации',
        hold: 'Задержать',
        block: 'Заблокировать',
        modal: {
          title: 'Заморозка пользователя',
          titleBlock: 'Блокировка пользователя',
          comment: 'Комментарий',
          hold: 'Заморозить',
          holdTime: 'Время заморозки',
          takeHoldTime: 'Выбирите время заморозки',
          close: 'Закрыть',
          hour: 'Час',
          day: 'День',
          threeDays: 'Три дня',
          success: 'Пользователь заморожен!',
        },
      },
      verification: {
        title: 'Верификация',
        passport: 'Паспорт',
        selfie: 'Селфи',
        verify: 'Верифицировать',
        cancel: 'Отменить',
      },
      balance: {
        title: 'Баланс',
        currency: 'Валюта',
        allcurrency: 'Все валюты',
        balance: 'Баланс',
        wallet: 'Кошелек',
        type: 'Тип',
        walletsHistory: 'История адресов',
        hide: 'Скрыть нулевые балансы',
        allTypes: 'Все типы',
        crypto: 'Crypto',
        cryptoasfiat: 'Crypto as fiat',
      },
      transactions: {
        title: 'Транзакции',
        table: {
          username: 'Пользователь',
          currency: 'Валюта',
          type: 'Тип',
          status: 'Статус',
          date: 'Дата',
          amount: 'Объем',
          reason: 'Ризон',
          recipient: 'Получатель',
        },
      },
      loginLogs: {
        title: 'Логи',
        table: {
          type: 'Тип',
          usedIP: 'Использованный IP',
          date: 'Дата',
        },
      },
      settings: {
        title: 'Настройки',
        enabled: 'Подключено',
        verified: 'Верифицирован',
        unverified: 'Не верифицирован',
        disabled: 'Отключено',
        language: 'Язык',
        BTTToken: 'BTT Токен',
        phoneVerification: 'Верификация телефона',
        KYCVerification: 'KYC верификация',
      },
      locks: {
        title: 'Блокировки',
        table: {
          lockType: 'Тип блокировки',
          banStart: 'Начало блокировки',
          banEnd: 'Конец блокировки',
          comment: 'Комментарий',
          time: 'Время',
          unholdDate: 'Время разблокировки',
          changeTime: 'Имзенить время',
          unhold: 'Разблокировать',
        },
      },
    },
  },
  'faq-editor': {
    add: 'Добавить',
    faq: 'Список FAQ',
    tableTitle: 'Заголовок',
    tableActions: 'Действия',
    modal: {
      enterFaqName: 'Введите название FAQ',
      sure: 'Вы уверены?',
      notRevert: 'Вы не сможете вернуть это!',
      deleteIt: 'Да, удалить!',
      deleted: 'Удалено!',
      deleteSuccess: 'Вы удалили:',
      success: 'Завершено',
      cancel: 'Отменить',
    },
    editor: {
      back: 'Назад',
      save: 'Сохранить',
      selectedLanguage: 'Выбранный язык:',
    },
  },
  'forgot-pass': {
    forgotPass: 'Забыли пароль?',
    forgotDesc: 'Type in your email address below and we\'ll send you an email with instructions on how to create a new password',
    resetPass: 'Изменить пароль',
    checkEmail: 'Проверьте ваш email',
    checkDesc: 'The email with further instructions was sent to the submitted email address. If you don’t receive a message in 5 minutes, check the junk folder. If you are still experiencing any problems, contact support at support@domain.com',
    ok: 'Ок',
    createPass: 'Создать новый пароль',
    passDesc: 'Type in your email address below and we\'ll send you an email with instructions on how to create a new password',
    newPass: 'Новый пароль',
    confirmNewPass: 'Подтвердите новый пароль',
    passSuccess: 'Your password has been changed successfully!',
    successDesc: 'Click the button to enter your personal wallet account',
  },
  login: {
    smallTitle: 'Пожалуйста',
    bigTitle: 'Войдите',
    button: 'Войти',
    email: 'Email',
    password: 'Пароль',
    token: 'Токен 2FA',
    forgotPass: 'Забыли пароль?',
  },
  registration: {
    title: 'Новый пользователь',
    firstName: 'Имя',
    lastName: 'Фамилия',
    password: 'Пароль',
    passwordConfirm: 'Повторите пароль',
    token2FA: 'Код',
    confirm: 'Подтвердить',
    complete: 'Завершить',
  },
  chat: {
    chat: 'Чат',
    messages: 'Сообщения',
    nothingFound: 'Ничего не найдено',
    inputPlaceholder: 'Введите текст',
    search: 'Поиск',
    dialogActive: 'Активные',
    dialogInactive: 'Неактивные',
    noInActive: 'Нет не активных диалогов',
    noActive: 'Нет активных диалогов',
    endDialogue: 'Завершить диалог',
    modal: {
      title: 'Завершение диалога',
      infoText: 'Вы уверены что хотите завершить диалог?',
      complete: 'Завершить',
      cancel: 'Отмена',
    },
    messageError: 'Длина сообщения не должна превышать 500 символов',
    messageLengthError: 'Не более 3-ех файлов',
    messageErrorNull: 'Сообщение не может быть пустым',
    messageErrorFileExtension: 'Загружаемый файл должен иметь тип картинки или документа',
    messageErrorFileSize: 'Размер файлов не должен превышать 15МБ',
    emptyDialog: 'Выберите диалог',
    you: 'Вы',
  },
};
