// eslint-disable-next-line max-len
// Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
// Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
// Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io

import React, { useCallback, useState } from 'react';
import { useThrottle } from './hooks';
import { Button, UserInfo } from './components';
import { User } from './types';
import { UserService } from './services';

const userService = new UserService();

function App(): JSX.Element {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  // Получение случайного пользователя
  const receiveRandomUser = useCallback(async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    const userId = Math.floor(Math.random() * (10 - 1)) + 1;
    const user = await userService.getUser<User>(userId, userId);

    setUserInfo(user);
  }, []);

  const receiveRandomUserThrottled = useThrottle({
    callbackFn: receiveRandomUser as <T, >(args?: T) => any,
    throttleMs: 500,
  });

  return (
    <div>
      <header>Get a random user</header>
      <Button text="get random user" onClick={receiveRandomUserThrottled} />
      {userInfo && <UserInfo user={userInfo} />}
    </div>
  );
}

export default App;
