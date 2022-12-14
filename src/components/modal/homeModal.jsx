import React, { useState } from 'react';
import styles from './homeModal.module.css';
import { authService } from '../../fbase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useEffect } from 'react';

const HomeModal = ({ openModal, setOpenModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };
  useEffect(() => {
    console.log(email);
    console.log(password);
  }, [email, password]);
  const onSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(authService, email, password).then(
      (userId) => {
        const user = userId.user;
      }
    );
  };
  const onClick = async (e) => {
    if (e.target.id === 'modalClose') {
      setOpenModal(!openModal);
    }
  };
  return (
    <div id='modalClose' className={styles.container} onClick={onClick}>
      <div className={styles.contents}>
        <button
          className={styles.closeBtn}
          id='modalClose'
          type='button'
          onClick={onClick}
        >
          X
        </button>
        <p className={styles.title}>회원가입</p>
        <form className={styles.signForm} onSubmit={onSubmit}>
          <input required type='text' placeholder='이름' />
          <input
            required
            type='email'
            name='email'
            placeholder='아이디(이메일)'
            onChange={onChange}
          />
          <input
            required
            minLength='6'
            maxLength='16'
            type='password'
            name='password'
            placeholder='비밀번호(6~16자 이내)'
            onChange={onChange}
          />
          <input
            required
            minLength='6'
            maxLength='16'
            type='password'
            placeholder='비밀번호 확인'
          />
          <input
            required
            type='tel'
            placeholder='휴대폰 번호(-빼고 번호만 입력)'
          />
          <input
            required
            className={styles.signUpBtn}
            type='submit'
            value='가입하기'
          />
        </form>
      </div>
    </div>
  );
};

export default HomeModal;
