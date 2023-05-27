import Image from 'next/image';
import React, { useState, useRef, ChangeEvent, DragEvent, CSSProperties } from 'react';
import { IconTextSize } from "@tabler/icons-react";
import { Checkbox, ColorInput, Select } from '@mantine/core';


interface TextField {
  id: number;
  text: string;
  position: {
    x: number;
    y: number;
  };
  fontSize: number;
  color: any;
  background: any;
}

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [textFields, setTextFields] = useState<TextField[]>([]);
  const [selectedFontSize, setSelectedFontSize] = useState<number>(14);
  const [selectedColor, setSelectedColor] = useState<string>('Seçiniz');
  const [selectedBGColor, setSelectedBGColor] = useState<string>('Seçiniz');
  const [selectedBGColorCheck, setSelectedBGColorCheck] = useState<boolean>(false);
  const dropAreaRef = useRef<any>(null);
  const textFieldRefs = useRef<HTMLDivElement[]>([]);
  let domtoimage = require('dom-to-image');

  const handleImageUpload = (file: File) => {
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleAddTextField = () => {
    const newTextField: TextField = {
      id: Date.now(),
      text: '',
      position: { x: 10, y: 10 },
      fontSize: selectedFontSize,
      color: selectedColor,
      background: selectedBGColorCheck && selectedBGColor
    };
    setTextFields([...textFields, newTextField]);
  };

  const handleTextFieldChange = (
    event: ChangeEvent<HTMLDivElement>,
    id: number
  ) => {
    const updatedFields = textFields.map((field) =>
      field.id === id ? { ...field, text: event.target.textContent || '' } : field
    );
    setTextFields(updatedFields);
  };

  const handleTextFieldDragStart = (
    event: DragEvent<HTMLDivElement>,
    id: number
  ) => {
    const textField = textFields.find((field) => field.id === id);
    if (textField) {
      event.dataTransfer.setData('text/plain', String(id));
      event.dataTransfer.setDragImage(event.target as Element, 0, 0);
    }
  };

  const handleTextFieldDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleTextFieldDrop = (event: DragEvent<HTMLDivElement>, id: number) => {
    event.preventDefault();
    const textField = textFields.find((field) => field.id === id);
    if (textField) {
      const updatedFields = textFields.map((field) =>
        field.id === id ? { ...field, position: { x: event.clientX, y: event.clientY } } : field
      );
      setTextFields(updatedFields);
    }
  };

  const handleTextFieldRef = (ref: HTMLDivElement | null) => {
    if (ref && !textFieldRefs.current.includes(ref)) {
      textFieldRefs.current.push(ref);
    }
  };

  const handleBGColorCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectedBGColorCheck(checked);
  };

  const handleDownload = () => {
    const imageContainer: any = document.querySelector('.image-container');
    if (imageContainer) {
      // Hide text fields overflow
      const textFieldsContainer = imageContainer.querySelector('.text-fields-container');
      if (textFieldsContainer) {
        textFieldsContainer.style.overflow = 'hidden';
      }

      // Hide close buttons
      const closeButtons = imageContainer.querySelectorAll('.close-button');
      closeButtons.forEach((button: any) => {
        button.style.display = 'none';
      });

      domtoimage.toJpeg(imageContainer, { quality: 0.95 })
        .then(function (dataUrl: any) {
          const link = document.createElement('a');
          link.download = 'image.jpg';
          link.href = dataUrl
          link.target = '_blank';
          link.style.position = 'fixed';
          link.style.top = '0';
          link.style.left = '0';
          link.style.zIndex = '9999';
          link.style.height = '0';
          link.style.overflow = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          if (textFieldsContainer) {
            textFieldsContainer.style.overflow = 'visible';
          }
          closeButtons.forEach((button: any) => {
            button.style.display = 'block';
          });
        });
    }
  };

  return (
    <div
      ref={dropAreaRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}>
      {selectedImage ? (
        <div className="relative flex gap-10">
          <div className='image-container relative overflow-hidden'>
            <Image width={100} height={100} src={selectedImage} alt="Uploaded" className="pointer-events-none !w-auto !h-auto max-w-full lg:max-w-[600px]" />
            {textFields.map((field) => {
              const textFieldStyle: CSSProperties = {
                left: field.position.x,
                top: field.position.y,
                position: 'absolute',
                fontSize: `${field.fontSize}px`,
                color: field.color,
                background: field.background,
                minWidth: 100,
                minHeight: 40,
              };
              return (
                <>
                  <div key={field.id}
                    onBlur={(event) => handleTextFieldChange(event, field.id)}
                    draggable
                    onDragStart={(event) => handleTextFieldDragStart(event, field.id)}
                    onDragOver={handleTextFieldDragOver}
                    onDrag={(event) => handleTextFieldDrop(event, field.id)}
                    ref={handleTextFieldRef}
                    style={textFieldStyle}
                    className='min-w-[100px] min-h-[40px] flex justify-center items-center rounded resize'>
                    <div contentEditable className='outline-none font-bold text-center !p-0 !m-0 !leading-0'>
                      Metin Gir
                    </div>
                    <button
                      className="close-button absolute -top-4 -right-4 text-sm bg-e15146 text-white rounded-full !leading-none w-5 h-5"
                      onClick={() => {
                        const updatedFields = textFields.filter((item) => item.id !== field.id);
                        setTextFields(updatedFields);
                      }}>
                      x
                    </button>
                  </div>
                </>
              );
            })}
          </div>
          <div className='flex flex-col gap-2 pt-4'>
            <div>
              <Select
                icon={<IconTextSize size={15} />}
                label="Font Büyüklüğü"
                value={selectedFontSize.toString()}
                onChange={(event: string) => {
                  const fontSize = parseInt(event);
                  setSelectedFontSize(fontSize);
                }}
                data={[
                  { value: "10", label: '10px' },
                  { value: "12", label: '12px' },
                  { value: "14", label: '14px' },
                  { value: "16", label: '16px' },
                  { value: "18", label: '18px' },
                  { value: "20", label: '20px' },
                  { value: "24", label: '24px' },
                  { value: "28", label: '28px' },
                  { value: "32", label: '32px' },
                  { value: "36", label: '36px' },
                  { value: "40", label: '40px' },
                  { value: "44", label: '44px' },
                  { value: "48", label: '48px' },
                ]}
              />
            </div>
            <div>
              <ColorInput placeholder="Renk Seçiniz" label="Yazı Rengi"
                value={selectedColor}
                onChange={(event: string) => {
                  const color = event;
                  setSelectedColor(color);
                }}
                defaultValue={"#FFFFFF"}
              />
            </div>
            <div className='mt-2'>
              <Checkbox
                label="Yazıya Arka Plan Rengi Ekle"
                checked={selectedBGColorCheck}
                onChange={handleBGColorCheckChange}
              />
            </div>
            {selectedBGColorCheck &&
              <div>
                <ColorInput placeholder="Renk Seçiniz" label="Arka Plan Rengi"
                  value={selectedBGColor}
                  onChange={(event: string) => {
                    if (selectedBGColorCheck) {
                      const color = event;
                      setSelectedBGColor(color);
                    }
                    else {
                      setSelectedBGColor('');
                    }
                  }}
                  defaultValue={"#FFFFFF"}
                />
              </div>
            }
            <label htmlFor="">
              <button className='rounded bg-e15146 text-white font-bold p-3 w-full mt-2' onClick={handleAddTextField}>Yazı Alanı Ekle</button>
            </label>
            <button className='rounded bg-e15146 text-white font-bold p-3 w-full mt-2' onClick={handleDownload}>Resmi İndir</button>
          </div>
        </div>
      ) : (
        <>
          <div className='w-[400px] h-[700px] rounded border border-e15146 border-dashed flex justify-center items-center m-4 relative cursor-pointer'>
            <input
              type="file"
              onChange={handleFileInputChange}
              className='absolute w-full h-full top-0 left-0 opacity-0'
              ref={dropAreaRef}
            />
            <div className='text-sm text-e15146 font-bold'>Tıklayarak veya sürükleyerek resim yükleyebilirsiniz.</div>
          </div>
        </>
      )}
    </div>
  );
}
