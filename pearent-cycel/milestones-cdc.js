/* Phase 4: short examples from the CDC "Learn the Signs. Act Early." milestone
   checklists (2022 revision), paraphrased for parents. Each checkpoint links to the
   original CDC page through RafiqAgeContent.milestoneResource(). CDC lists what most
   children (75% or more) can do by each age. These are examples to notice, not a
   test, a score, or a diagnosis, and Rafiq never compares a child against them. */
(() => {
 'use strict';
 const source={publisher:'Centers for Disease Control and Prevention (CDC)',programme:'Learn the Signs. Act Early.',revision:'2022 checklists',url:'https://www.cdc.gov/act-early/milestones/',checkedAt:'2026-11-13',note:'Paraphrased examples; the CDC page has the full list.'};
 const domains={
  social:{en:'Social and emotional',ar:'اجتماعي وعاطفي',icon:'smile'},
  language:{en:'Language and communication',ar:'اللغة والتواصل',icon:'talk'},
  cognitive:{en:'Learning and thinking',ar:'التعلّم والتفكير',icon:'puzzle'},
  movement:{en:'Movement and physical',ar:'الحركة والجسم',icon:'move'}
 };
 const i=(en,ar)=>({en,ar});
 const checkpoints={
  2:{social:[i('Calms down when spoken to or picked up','بهدى لما تحكوا معه أو تحملوه'),i('Smiles when you talk to or smile at them','بيبتسم لما تحكوا معه أو تبتسموله')],
     language:[i('Makes sounds other than crying','بيطلّع أصوات غير البكي'),i('Reacts to loud sounds','بينتبه للأصوات العالية')],
     cognitive:[i('Watches you as you move','بيتابعكم بعيونه وإنتو بتتحركوا'),i('Looks at a toy for several seconds','بيطّلع على لعبة كم ثانية')],
     movement:[i('Holds head up when on tummy','بيرفع راسه وهو على بطنه'),i('Moves both arms and both legs','بيحرّك إيديه وإجريه الثنتين')]},
  4:{social:[i('Smiles on their own to get your attention','بيبتسم من حاله ليلفت انتباهكم'),i('Chuckles when you try to make them laugh','بيضحك ضحكة خفيفة لما تحاولوا تضحّكوه')],
     language:[i('Makes cooing sounds like “oooo” and “aahh”','بيناغي بأصوات مثل «أووو» و«آآه»'),i('Turns head toward the sound of your voice','بيلفّ راسه باتجاه صوتكم')],
     cognitive:[i('Looks at their hands with interest','بيطّلع على إيديه باهتمام'),i('If hungry, opens mouth on seeing breast or bottle','إذا جوعان، بيفتح تمّه لما يشوف الرضعة')],
     movement:[i('Holds head steady without support when held','بيثبّت راسه بدون سند وإنتو حاملينه'),i('Brings hands to mouth','بيوصّل إيديه لتمّه')]},
  6:{social:[i('Knows familiar people','بيعرف الناس اللي بيشوفهم دايمًا'),i('Laughs','بيضحك')],
     language:[i('Takes turns making sounds with you','بيتبادل معكم الأصوات بالدور'),i('Makes squealing noises','بيطلّع أصوات صريخ فرح')],
     cognitive:[i('Reaches to grab a toy they want','بيمدّ إيده ليمسك لعبة بدّه إياها'),i('Puts things in their mouth to explore them','بيحط الأشياء بتمّه ليستكشفها')],
     movement:[i('Rolls from tummy to back','بيتقلّب من بطنه على ظهره'),i('Leans on hands to support themselves when sitting','بيتسنّد على إيديه وهو قاعد')]},
  9:{social:[i('Is shy, clingy or fearful around strangers','بيخجل أو بيتعلّق فيكم أو بيخاف من الغريب'),i('Smiles or laughs when you play peek-a-boo','بيبتسم أو بيضحك لما تلعبوا معه «وين راح؟ هيّاه»')],
     language:[i('Makes different sounds like “mamamama” and “babababa”','بيطلّع أصوات مختلفة مثل «مامامام» و«بابابا»'),i('Lifts arms up to be picked up','بيرفع إيديه ليطلب تحملوه')],
     cognitive:[i('Looks for objects when they drop out of sight','بيدوّر على الأشياء لما توقع وتختفي'),i('Bangs two things together','بيخبط شغلتين ببعض')],
     movement:[i('Gets to a sitting position by themselves','بيقعد لحاله'),i('Moves things from one hand to the other','بينقل الأشياء من إيد لإيد')]},
  12:{social:[i('Plays games with you, like pat-a-cake','بيلعب معكم ألعاب مثل التصفيق')],
     language:[i('Waves “bye-bye”','بيلوّح «باي»'),i('Understands “no”','بيفهم كلمة «لا»')],
     cognitive:[i('Puts something in a container','بيحط شي جوّا علبة'),i('Looks for things they see you hide','بيدوّر على أشياء شافكم تخبّوها')],
     movement:[i('Pulls up to stand','بيتسنّد وبيوقف'),i('Picks things up between thumb and pointer finger','بيلقط الأشياء بين الإبهام والسبّابة')]},
  15:{social:[i('Copies other children while playing','بيقلّد الأطفال وهو بيلعب'),i('Shows you an object they like','بيفرجيكم شي بيحبه')],
     language:[i('Tries to say one or two words besides “mama” or “dada”','بيحاول يقول كلمة أو كلمتين غير «ماما» و«بابا»'),i('Points to ask for something or to get help','بيأشّر ليطلب شي أو مساعدة')],
     cognitive:[i('Tries to use things the right way, like a cup or a book','بيحاول يستعمل الأشياء صح، مثل الكاسة أو الكتاب'),i('Stacks at least two small objects','بيركّب شغلتين صغار فوق بعض')],
     movement:[i('Takes a few steps on their own','بيمشي كم خطوة لحاله'),i('Uses fingers to feed themselves some food','بياكل شوية أكل بأصابعه')]},
  18:{social:[i('Points to show you something interesting','بيأشّر ليفرجيكم شي لفت انتباهه'),i('Looks at a few pages in a book with you','بيقلّب معكم كم صفحة من كتاب')],
     language:[i('Tries to say three or more words besides “mama” or “dada”','بيحاول يقول ٣ كلمات أو أكثر غير «ماما» و«بابا»'),i('Follows one-step directions without gestures','بينفّذ طلب من خطوة وحدة بدون إشارة')],
     cognitive:[i('Copies you doing chores, like sweeping','بيقلّدكم بشغل البيت، مثل الكنس'),i('Plays with toys in a simple way, like pushing a toy car','بيلعب بالألعاب بطريقة بسيطة، مثل يدفع سيارة')],
     movement:[i('Walks without holding on to anyone or anything','بيمشي بدون ما يمسك بحدا أو بشي'),i('Scribbles','بيشخبط')]},
  24:{social:[i('Notices when others are hurt or upset','بينتبه لما حدا يتأذّى أو يزعل'),i('Looks at your face to see how to react in a new situation','بيطّلع على وجهكم ليعرف كيف يتصرف بموقف جديد')],
     language:[i('Says at least two words together, like “more milk”','بيقول كلمتين مع بعض، مثل «كمان حليب»'),i('Points to at least two body parts when asked','بيأشّر على جزأين من جسمه لما تسألوه')],
     cognitive:[i('Holds something in one hand while using the other','بيمسك شي بإيد وبيستعمل الإيد الثانية'),i('Plays with more than one toy at the same time','بيلعب بأكثر من لعبة بنفس الوقت')],
     movement:[i('Kicks a ball','بيشوط الطابة'),i('Runs','بيركض')]},
  30:{social:[i('Plays next to other children and sometimes with them','بيلعب جنب الأطفال وأحيانًا معهم'),i('Follows simple routines when told, like helping to pick up toys','بيتبع روتين بسيط لما تطلبوا، مثل يساعد يلمّ الألعاب')],
     language:[i('Says about 50 words','بيقول حوالي ٥٠ كلمة'),i('Says two or more words with an action word, like “doggie run”','بيقول كلمتين أو أكثر مع فعل، مثل «الكلب بيركض»')],
     cognitive:[i('Uses things to pretend, like feeding a block to a doll','بيستعمل الأشياء بلعب التخيّل، مثل يطعمي الدمية'),i('Follows two-step instructions','بينفّذ طلب من خطوتين')],
     movement:[i('Takes some clothes off by themselves','بيشلح بعض أواعيه لحاله'),i('Jumps off the ground with both feet','بينطّ عن الأرض بإجريه الثنتين')]},
  36:{social:[i('Calms down within 10 minutes after you leave, like at childcare','بيهدى خلال ١٠ دقايق بعد ما تتركوه، مثل بالحضانة'),i('Notices other children and joins them to play','بينتبه للأطفال وبينضمّ يلعب معهم')],
     language:[i('Has a conversation with at least two back-and-forth exchanges','بيحكي معكم محادثة فيها تبادلين على الأقل'),i('Asks “who”, “what”, “where” or “why” questions','بيسأل «مين، شو، وين، ليش»')],
     cognitive:[i('Draws a circle when you show them how','بيرسم دائرة لما تفرجوه كيف'),i('Avoids touching hot objects when warned','بيبعد عن الأشياء السخنة لما تنبّهوه')],
     movement:[i('Strings items together, like large beads','بيلضم أشياء مع بعض، مثل الخرز الكبير'),i('Uses a fork','بيستعمل الشوكة')]},
  48:{social:[i('Pretends to be something else during play','بيتخيّل حاله شي ثاني وهو بيلعب'),i('Comforts others who are hurt or sad','بيواسي اللي متأذّي أو زعلان')],
     language:[i('Says sentences with four or more words','بيقول جمل فيها ٤ كلمات أو أكثر'),i('Talks about at least one thing that happened during their day','بيحكي عن شي صار معه بيومه')],
     cognitive:[i('Names a few colours of items','بيسمّي كم لون'),i('Tells what comes next in a well-known story','بيحكي شو بيصير بعدين بقصة بيعرفها')],
     movement:[i('Catches a large ball most of the time','بيمسك طابة كبيرة أغلب المرات'),i('Unbuttons some buttons','بيفكّ بعض الأزرار')]},
  60:{social:[i('Follows rules or takes turns when playing games','بيلتزم بالقوانين أو بالدور لما يلعب'),i('Does simple chores at home','بيساعد بشغلات بسيطة بالبيت')],
     language:[i('Tells a story they heard or made up, with at least two events','بيحكي قصة سمعها أو ألّفها فيها حدثين على الأقل'),i('Keeps a conversation going with more than three exchanges','بيكمّل محادثة فيها أكثر من ٣ تبادلات')],
     cognitive:[i('Counts to 10','بيعدّ لـ١٠'),i('Pays attention for 5 to 10 minutes during activities','بينتبه من ٥ لـ١٠ دقايق خلال الأنشطة')],
     movement:[i('Buttons some buttons','بيسكّر بعض الأزرار'),i('Hops on one foot','بينطّ على إجر وحدة')]}
 };
 // Uses the same checkpoint the CDC link uses, so text and link always match.
 function forContext(context){const resource=window.RafiqAgeContent?.milestoneResource(context);if(!resource)return null;const month=resource.minMonths;return checkpoints[month]?{month,resource,items:checkpoints[month]}:null;}
 window.RafiqMilestoneGuide={source,domains,checkpoints,forContext};
})();
