import React, { useState } from 'react';
import styles from './textShadowManager.module.css';
import common from '../../common/common.module.css';
import hexToRgb from '../../components/hexToRgb/hexToRgb';
import TextShadowSampleList from '../../components/textShadowSampleList/textShadowSampleList';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect } from 'react';
import { useRef } from 'react';
import SaveTheCustomButton from '../../components/SaveTheCustomButton/SaveTheCustomButton';
import TextShadowCustomStyleCode from '../../components/TextShadowCustomStyle/TextShadowCustomStyleCode';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { dbService } from '../../fbase';

const TextShadowManager = ({ userInfo }) => {
  const resultTextRef = useRef();
  const [inputValue, setInputValue] = useState({
    shiftRight: 2,
    shiftDown: 2,
    blur: 0,
    opacity: 100,
    colorPalette: '#0000FF',
    resultBoxColor: '#000000',
    resultBoxBackgroundColor: '#999999',
    rgba: 'rgba(0, 0, 0, 1)',
  });
  const [textShadowStyles, setTextShadowStyles] = useState([]);

  const changedValue = (e) => {
    const key = e.target.name;
    setInputValue((prev) => ({ ...prev, [key]: e.target.value }));
  };

  useEffect(() => {
    setInputValue((prev) => ({
      ...prev,
      rgba: hexToRgb(inputValue.colorPalette, inputValue.opacity / 100),
    }));
    resultTextRef.current.style.textShadow = `${inputValue.shiftRight}px ${inputValue.shiftDown}px ${inputValue.blur}px ${inputValue.rgba}`;
    resultTextRef.current.style.color = `${inputValue.resultBoxColor}`;
    resultTextRef.current.style.backgroundColor = `${inputValue.resultBoxBackgroundColor}`;
  }, [
    inputValue.shiftRight,
    inputValue.shiftDown,
    inputValue.blur,
    inputValue.opacity,
    inputValue.colorPalette,
    inputValue.resultBoxColor,
    inputValue.resultBoxBackgroundColor,
    inputValue.rgba,
  ]);
  useEffect(() => {
    onSnapshot(collection(dbService, 'textShadowData'), (snapshot) => {
      const styleArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTextShadowStyles(styleArr);
    });
  }, []);
  const onClick = async () => {
    await addDoc(collection(dbService, 'textShadowData'), {
      style: `text-shadow: ${inputValue.shiftRight}px ${inputValue.shiftDown}px ${inputValue.blur}px ${inputValue.rgba};`,
      styleCode: `${inputValue.shiftRight}px ${inputValue.shiftDown}px ${inputValue.blur}px ${inputValue.rgba}`,
      createdAt: Date.now(),
      creatorId: userInfo.uid,
    });
  };
  return (
    <>
      <section className={styles.container}>
        <p className={common.title}>Text Shadow Manager</p>
        <div className={styles.stateInfoArea}>
          <div className={styles.shiftRightArea}>
            <span>Shift Right: {inputValue.shiftRight}</span>
            <input
              type='range'
              name='shiftRight'
              min='-40'
              max='40'
              value={inputValue.shiftRight}
              onChange={changedValue}
            />
          </div>
          <div className={styles.shiftDownArea}>
            <span>Shift Down: {inputValue.shiftDown}</span>
            <input
              type='range'
              name='shiftDown'
              min='-40'
              max='40'
              value={inputValue.shiftDown}
              onChange={changedValue}
            />
          </div>
          <div className={styles.blurArea}>
            <span>Blur: {inputValue.blur}</span>
            <input
              type='range'
              name='blur'
              min='0'
              max='20'
              value={inputValue.blur}
              onChange={changedValue}
            />
          </div>
          <div className={styles.opacityArea}>
            <span>Opacity: {inputValue.opacity / 100}</span>
            <input
              type='range'
              name='opacity'
              min='0'
              max='100'
              value={inputValue.opacity}
              onChange={changedValue}
            />
          </div>
          <div className={styles.colorBoxArea}>
            <div className={styles.colorBoxWrap}>
              <label className={styles.colorLabel} htmlFor='colorInput'>
                text-shadow color
              </label>
              <input
                className={styles.colorBox}
                id='colorInput'
                type='color'
                name='colorPalette'
                value={inputValue.colorPalette}
                onChange={changedValue}
              />
            </div>
            <div className={styles.colorBoxWrap}>
              <label className={styles.colorLabel} htmlFor='textColorInput'>
                text color
              </label>
              <input
                className={styles.colorBox}
                id='textColorInput'
                type='color'
                name='resultBoxColor'
                value={inputValue.resultBoxColor}
                onChange={changedValue}
              />
            </div>
            <div className={styles.colorBoxWrap}>
              <label
                className={styles.colorLabel}
                htmlFor='backgroundColorInput'
              >
                background color
              </label>
              <input
                className={styles.colorBox}
                id='backgroundColorInput'
                type='color'
                name='resultBoxBackgroundColor'
                value={inputValue.resultBoxBackgroundColor}
                onChange={changedValue}
              />
            </div>
          </div>
          <div
            className={styles.textShadowInfo}
            onMouseDown={(e) => {
              e.target.style.scale = '0.9';
            }}
            onMouseUp={(e) => {
              e.target.style.scale = '1';
            }}
          >
            <CopyToClipboard
              text={`text-shadow: ${inputValue.shiftRight}px ${inputValue.shiftDown}px ${inputValue.blur}px ${inputValue.rgba};`}
            >
              <p className={styles.textShadowCssInfo}>
                {inputValue.shiftRight}px {inputValue.shiftDown}
                px {inputValue.blur}px {inputValue.rgba}
                <br />
                Click To Copy
              </p>
            </CopyToClipboard>
          </div>
          <div ref={resultTextRef} className={styles.resultText}>
            <p>Result Text</p>
          </div>
        </div>
        <SaveTheCustomButton onClick={onClick} />
        <TextShadowCustomStyleCode
          textShadowStyles={textShadowStyles}
          userInfo={userInfo}
        />
        <TextShadowSampleList />
      </section>
    </>
  );
};

export default TextShadowManager;
