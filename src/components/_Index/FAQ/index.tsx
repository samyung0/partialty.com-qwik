/** @jsxImportSource react */
import { qwikify$ } from '@builder.io/qwik-react';
import { Disclosure } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';

// import QuestionMark from '~/assets/img/question_mark.png';

const faqs = [
  {
    question: 'What is so special about Partialty.com?',
    answer:
      'We have audio courses with beautiful highlights that syncs to the audio. The courses are carefully curated and are written in extremely easy-to-understand words so even absolute beginners can learn without any trouble. We also have exercises to test your knowledge and if you want to learn more, there is always an extra chapter at the end of each course that links your to different resources.',
  },
  {
    question: 'Who is this website for?',
    answer:
      "We mostly target beginners and intermediate developers which are looking for a place to start learning new front-end technologies/libraries. We aim to make the courses as easy to understand as possible so you don't have to read through a bunch of boring and complex terminologies. Learn as efficiently as possible!",
  },
  {
    question: 'What can we expect from the courses?',
    answer:
      'The courses are crashcourse-like and the important and useful topics will be covered. For visuals, we have mostly short sentences, bullet-points, highlights, code snippets and embeds, and voice overs for the audio. When you play the audio, the highlights will appear accordingly so you can follow along effortlessly. We also have MCQs and coding questions as exercises to test your knowledge.',
  },
  {
    question: 'Are the courses free?',
    answer: 'YESSSS! All courses available right now are absolutely free!',
  },
  {
    question: 'What new features/courses will the website have in future?',
    answer:
      'Currently we only have a limited number of courses. We plan to write a lot more courses in future and maybe also included bit of back-end libraries. We also want the community to be able to create their own courses so we are working on text editors and a membership system.',
  },
  {
    question: 'Can I contribute?',
    answer:
      'Yesss. If you want to create any courses or implement new features, feel free to email me at yungchinpang999@gmail.com and we will see what we can accomplish.',
  },
  {
    question: 'Can I donate to the creator?',
    answer:
      "Aiya, I'm glad you ask. Right now, we don't have any subscriptions but you can donate through stripe or buymeacoffee. (I'm a broke uni student but I'm passionate, wink)",
  },
];

const Faq = ({ logic, topButton = true }: { logic?: (deltaY: number) => any; topButton?: boolean }) => {
  return (
    <div className="relative overflow-x-hidden">
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        {topButton && (
          <button
            className="absolute left-[50%] top-[40px] -translate-x-[50%] text-xs text-gray-600 underline dark:text-gray-300 md:top-[7%] md:text-sm"
            onClick={() => {
              logic?.(-10);
            }}
          >
            Top
          </button>
        )}
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <div className="flex justify-center">
            <div className="relative inline-block overflow-visible">
              <h2 className="inline text-center font-mosk text-2xl font-bold leading-10  md:text-3xl">
                Frequently asked questions
              </h2>
              {/* <div className="absolute right-[-50px] top-[50%] -translate-y-[50%]">
                <img src={QuestionMark} alt="" width="20" height="20" className="translate-x-3" />
                <img src={QuestionMark} alt="" width="20" height="20" className="absolute top-0 -rotate-[24deg]" />
              </div> */}
            </div>
          </div>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left">
                        <span className="text-sm font-semibold leading-7 md:text-base">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-sm leading-7 text-gray-500 dark:text-gray-400 md:text-base">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default qwikify$(Faq);
