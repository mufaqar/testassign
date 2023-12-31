import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { skillsList } from '@/const/skills';
import { RxCross2 } from 'react-icons/rx';
import { Input } from '@/components/ui/input';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [skills, setSkills] = useState();
  const [value, setValue] = useState();
  const [selectedSkill, setSelectedList] = useState([]);
  const [isExistSkill, setIsExistSkill] = useState();
  const handleChange = (e) => {
    setValue(e.target.value);
    setSkills(
      skillsList.filter((i) =>
        i.skill.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };
  const AddSkill = (item) => {
    const isSkill = selectedSkill.findIndex((i) => i.skill === item.skill);
    if (isSkill === -1) {
      setSelectedList([...selectedSkill, item]);
      setIsExistSkill({
        state: true,
        text: `${item.skill} Added!`,
      });
    } else {
      setIsExistSkill({
        state: true,
        text: `${item.skill} already exist!`,
      });
    }
  };
  const removeSkill = (item) => {
    const remaningItem = selectedSkill.filter((i) => i.skill !== item.skill);
    setSelectedList(remaningItem);
    setIsExistSkill({
      state: true,
      text: `${item.skill} Removed!`,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExistSkill({
        state: false,
        text: '',
      });
    }, 4000);
    return () => clearTimeout(timer);
  }, [isExistSkill]);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setSelectedList((selectedSkill) => {
      const oldIndex = selectedSkill.findIndex((s) => s.id === active.id);
      const newIndex = selectedSkill.findIndex((s) => s.id === over.id);
      return arrayMove(selectedSkill, oldIndex, newIndex);
    });
  };

  return (
    <>
      <section className="max-w-[600px] mt-10 w-full mx-auto px-3">
        <div className="mb-6 relative">
          <Input
            type="text"
            value={value}
            onChange={(e) => handleChange(e)}
            id="default-input"
            className=" w-full !p-3 h-[3rem]"
            placeholder="Search Skill Here...!"
          />
          {value && (
            <ul className="bg-gray-100  w-full p-5 mt-1 rounded-lg max-h-80 overflow-x-hidden overflow-scroll">
              {skills.length > 0 ? (
                skills?.map((item, idx) => {
                  return (
                    <li
                      key={idx}
                      onClick={() => AddSkill(item)}
                      className={`p-2 border-b-[1px] cursor-pointer ${
                        skills.length === idx + 1
                          ? 'border-transparent'
                          : ' border-gray-200'
                      }`}
                    >
                      {item?.skill}
                    </li>
                  );
                })
              ) : (
                <li>Result Not Found!</li>
              )}
            </ul>
          )}
        </div>
        <div>
          <h2 className="font-semibold mb-3 text-xl">Selected Skills:</h2>
          <ul>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={selectedSkill}
                strategy={verticalListSortingStrategy}
              >
                {selectedSkill.map((s, id) => {
                  return (
                    <SkillList s={s} key={s.id} removeSkill={removeSkill} />
                  );
                })}
              </SortableContext>
            </DndContext>
          </ul>
        </div>
      </section>

      {/*  Notifaction Toast  */}
      <section
        className={`fixed transition-all duration-400 ease-in-out top-4 ${
          isExistSkill?.state ? 'right-4' : '-right-[100%]'
        } `}
      >
        <div
          id="toast-success"
          className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="sr-only">Check icon</span>
          </div>
          <div className="ml-3 text-sm font-normal">{isExistSkill?.text}</div>
          <button
            type="button"
            onClick={() => setIsExistSkill({ state: false, text: '' })}
            className=" -mx-1.5 -my-1.5 ml-2 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            data-dismiss-target="#toast-success"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}

const SkillList = ({ s, removeSkill }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: s.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <li className="relative">
      <h6
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="bg-gray-100 z-10 border p-3 mb-3 border-gray-200 rounded-lg flex  justify-between items-center"
      >
        <p>
          {s.skill} - <span className="text-gray-400 text-sm">{s.level} </span>
        </p>
      </h6>
      <button
        ref={setNodeRef}
        style={style}
        className="text-xl cursor-pointer absolute z-10 right-3 top-4 hover:scale-110"
        onClick={() => removeSkill(s)}
      >
        <RxCross2 />
      </button>
    </li>
  );
};
