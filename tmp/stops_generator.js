const fs = require('fs');

const rawData = `18 Hazari,S16
Abbaspur,S533
Abbottabad,S232
Adda Mangatanwala,S61
Adenzai,S284
Ahmadpur East,S23
Ahmedpur Sial,S88
Aliabad,S534
Alipur,S86
Alipur Chatha,S176
Allahabad,S113
Allai,S246
Alpuri,S310
Aminpur Bangla,S192
Anambar,S436
Aram Bagh,S354
Arifwala,S95
Ashwat,S437
Astore,S535
Athmuqam,S536
Attock,S209
Awaran,S438
Baba Kot,S439
Babusar,S537
Babuzai (Saidu Sharif/Mingora),S317
Badaber,S307
Baddomalhi,S138
Badin,S330
Bagh,S160
Bahawalnagar,S104
Bahawalpur,S89
Bahrain,S321
Bakot,S235
Bakrani,S367
Balakot,S291
Balambat,S285
Balanari,S440
Balouch,S539
Banda Daud Shah,S264
Bangla Gogera,S74
Bannu,S236
Bara,S272
Barang,S244
Barikot,S322
Barnala,S153
Basirpur,S110
Batkhela,S287
Battagram,S245
Behal,S230
Bela,S441
Besma,S442
Bhakkar,S229
Bhalwal,S146
Bhawana,S191
Bhikhi,S4
Bhimber,S154
Bhiria,S380
Bisham,S311
Bucheki,S575
Buleda,S443
Bulri Shah Karim,S415
Burewala,S94
Central Kurram,S277
Chachro,S417
Chak Aamru,S136
Chak Jhumra,S189
Chakwal,S166
Chalt,S541
Chaman,S444
Chamber,S413
Chamkani,S309
Chamla,S249
Changa Manga,S69
Charhoi,S540
Charsadda,S252
Chattar,S445
Chaubara,S202
Chawinda,S131
Chichawatni,S77
Chikar,S542
Chilas,S543
Chiniot,S190
Chishtian,S99
Chitral,S281
Choa Saidan Shah,S167
Chorasta Mian Khan,S109
Chorbat,S544
Chowk Azam,S18
Chowk Munda,S25
Chowki Bhagat,S185
Chund Bharwana,S195
Chunian,S70
Dadu,S334
Dadyal,S545
Daggar,S247
Daghoni,S546
Daharki,S339
Dahli,S418
Daira Din Panah,S29
Dajal,S41
Dalbandin,S446
Danyor,S547
Dara Adamkhel,S212
Daraban,S257
Daran,S447
Darel,S548
Dargai,S288
Darya Khan,S225
Dasht,S448
Daska,S128
Dassu,S267
Daud Khel,S217
Daulat Nagar,S142
Daur,S397
Depalpur,S107
Dera Allah Yar,S449
Dera Bugti,S450
Dera Ghazi Khan,S37
Dera Ismail Khan,S228
Dera Murad Jamali,S451
Dhadar,S452
Dhirkot,S161
Digkot,S58
Digri,S374
Dina,S150
Dinga,S173
Diplo,S419
Dir,S327
Dobandi,S453
Dokri,S368
Domel,S237
Drosh,S282
Drug,S454
Dubair,S274
Duki,S455
Dunga Bunga,S103
Dunyapur,S82
Dureji,S456
Ekka Ghund,S299
Eminabad,S120
Eminabad More,S121
Essa,S530
Faisalabad,S11
Faiz Ganj,S361
Faqir Wali,S101
Farooqabad,S531
Fateh Jang,S208
Fatehpur,S19
Fatehpur Thakiala (Nakyal),S549
Feroze Wattwan,S5
Fort Abbas,S100
Fort Monroe,S40
Gadani,S457
Gagra,S248
Gajjar,S458
Gamba,S550
Gambat,S362
Gandakha,S459
Gandawah,S460
Garh Moor,S22
Garhi Khairo,S347
Garhi Yasin,S401
Gawadar,S528
Gazg,S461
Ghalanai,S296
Gharo,S424
Ghazi,S261
Ghizer,S551
Ghorabari,S425
Ghotki,S338
Ghowari/Haldi,S553
Gichk,S462
Gilgit,S552
Girot,S198
Goharabad,S555
Gojal,S554
Gojra,S13
Gujar Khan,S152
Gujranwala,S122
Gujrat,S125
Gulabpur,S556
Gulistan,S463
Gultari,S557
Gumbat,S266
Gupis,S558
Gurjura,S434
Hafizabad,S178
Hajira,S158
Hala,S371
Hangu,S214
Harapa,S76
Harbour,S356
Hari Ghel,S560
Haripur,S260
Harnai,S464
Harnoli,S222
Haroonabad,S102
Hasilpur,S98
Hassan Abdal,S210
Hattian Bala,S561
Haveli,S562
Haveli Azad Kashmir,S162
Haveli Lakha,S106
Havelian,S233
Hazara,S141
Head Balloki,S577
Head Trimmu,S559
Heera Adda,S26
Hub,S465
Hujra Shah Muqeem,S108
Hunza,S563
Huramzai,S466
Hussain Bux Mari,S375
Hyderabad,S343
Hyderabad Thal,S200
Isa Khel,S220
Ishkoman,S565
Islamabad/Rawalpindi,S165
Islamgarh,S564
Islamkot,S420
Jacobabad,S346
Jaglot,S566
Jahanian,S81
Jalalpur Bhattian,S180
Jalalpur Jattan,S140
Jalalpur Pirwala,S84
Jam Nawaz Ali,S391
Jampur,S42
Jamrud,S270
Jamshed,S353
Jand,S207
Jaranwala,S574
Jati,S403
Jatoi,S87
Jehangira,S301
Jhal Jhao,S467
Jhal Magsi,S468
Jhang,S15
Jhawarian,S182
Jhelum,S149
Jhuddo,S376
Jiwani,S469
Johi,S335
Judba,S324
Kabal,S318
Kabirwala,S48
Kacha Khuh,S79
Kakki,S238
Kala Bagh,S216
Kala Shah Kaku,S116
Kalat,S470
Kallar Kahar,S168
Kallar Syedan,S156
Kallur Kot,S224
Kaloi,S421
Kalri,S193
Kamalia,S54
Kamoke,S119
Kamran Kalan,S211
Kandhkot,S357
Kandia,S268
Kandiaro,S381
Kangan Pur,S112
Kanjrur,S529
Karak,S262
Kardigap,S471
Karezat,S472
Karor,S20
Karor Pakka,S91
Kashmore,S358
Kasur,S64
Katlang,S295
Keris,S567
Keti Bunder,S426
Khairpur,S360
Khairpur Nathan Shah,S336
Khanewal,S80
Khangarh,S340
Khanpur,S47
Khanqah Dogran,S532
Khansar,S227
Khaplu,S568
Khar,S239
Kharan,S473
Kharian,S145
Kharianwala,S3
Kharmang,S569
Kharo Chan,S404
Khewra,S169
Khipro,S392
Khudian Khas,S115
Khuiratta,S570
Khurrianwala,S10
Khushab,S197
Khuzdar,S474
Khwazakhela,S319
Killa Abdullah,S475
Killa Saifullah,S476
Kingra Mor,S129
Kingri,S363
Kohat,S213
Kohlu,S477
Kot Addu,S30
Kot Arab Ali Khan,S143
Kot Chutta,S43
Kot Diji,S364
Kot Ghulam Muhammad,S377
Kot Momin,S181
Kot Radha Kishan,S66
Kot Sultan,S28
Kotla Jam,S226
Kotli,S157
Kotri,S349
Kulachi,S256
Kumrat Vally,S538
Kundian,S221
Kunri,S429
Lachi,S265
Lahor,S315
Lahore,S1
Lakki Marwat,S279
Lala Musa,S144
Lalian,S184
Landi Kotal,S271
Latifabad,S344
Layyah,S21
Leepa,S572
Lehri,S478
Liaquatpur,S49
Lodhran,S90
Loiband,S479
Lora,S234
Loralai,S480
Lower Kurram,S278
Lower Orakzai,S304
Luddan,S97
Luni,S481
Mach,S482
Mailsi,S92
Maiwand,S483
Malakwal,S171
Mamu Kanjan,S55
Mamund,S240
Manawala,S7
Mand,S484
Mandanr,S250
Mandi Ahmed Abad,S111
Mandi Bahauddin,S172
Mandi Bhalwal,S147
Mandi Faizabad,S62
Manga Mandi,S67
Mangochar,S485
Manjhand,S351
Manjhipur,S486
Mankera,S201
Mansehra,S290
Mardan,S293
Mashabrum,S573
Mashkai,S487
Mastuj,S325
Mastung,S488
Mathra,S308
Matiari,S370
Matli,S331
Matta,S320
Mauripur,S355
Mehar,S337
Mekhtar,S489
Mian Channu,S78
Miani,S170
Mianwali,S219
Minchinabad,S105
Miro Khan,S385
Mirpur,S155
Mirpur Bathoro,S405
Mirpur Mathelo,S341
Mirpur Sakro,S427
Mirpurkhas,S373
Mithi,S416
Moola,S490
More Khunda,S576
Moro,S382
Mulkhow,S326
Multan,S46
Muridke,S117
Murree,S164
Musakhel,S491
Muslim Bagh,S492
Muzaffarabad,S163
Muzaffargarh,S44
Naal,S493
Nag,S494
Nagarparkar,S422
Nainan Kot,S135
Nankana Sahib,S60
Nara,S365
Narang Mandi,S139
Narowal,S137
Nasirabad,S386
Naushahro Feroze,S379
Naushehra,S204
Nawabshah,S396
Nawagai,S242
Nawan Kot,S17
New Sukkur,S408
Nok Kundi,S495
Noorpur Thal,S199
Nowshera,S300
Nowshera Virkan,S179
Nurkot,S134
Oghi,S292
Okara,S73
Ormara,S496
Ornach,S497
Pabbi,S302
Paharpur,S255
Painsra,S12
Pakpattan,S96
Pallandri,S578
Panjgur,S498
Pano Aqil,S409
Panwan,S8
Paroa,S258
Paroom,S499
Pasni,S500
Pasrur,S132
Patika,S579
Pattan,S269
Pattoki,S71
Peer Jaggi,S27
Peshawar City,S305
Phalia,S174
Phander,S580
Phelawagh,S501
Phool Nagar,S68
Pindi Bhattian,S186
Pindi Gheb,S206
Pindiali,S297
Piplan,S223
Pir Mahal,S52
Pishin,S502
Pithoro,S430
Punial,S581
Puran,S312
Qadirabad,S175
Qamar Din Karez,S503
Qambar,S383
Qasba Gujrat,S32
Qasimabad,S345
Qazi Ahmed,S398
Qila Didar Singh,S177
Qubo Saeed Khan,S387
Rahim Yar Khan,S45
Rahwali,S123
Raiwind,S65
Rajana,S53
Rajanpur,S34
Rang Pur,S24
Ranolia,S275
Ratodero,S369
Rawalakot,S159
Razar,S316
Renala Khurd,S72
Rohri,S410
Rojhan,S36
Rokhri,S218
Roundu,S582
Sadhoke,S118
Sadiqabad,S38
Saeedabad,S372
Safdarabad,S187
Safi,S298
Sahiwal,S75
Sakhi Sarwer,S39
Sakran,S504
Sakrand,S399
Salarzai,S241
Saleh Pat,S411
Samahni,S583
Samar Bagh,S286
Samaro,S431
Sambaza,S505
Sambrial,S126
Samundri,S59
Sanawan,S31
Sanghar,S390
Sangla Hill,S188
Sangsillah,S506
Sanjavi,S507
Sarai Alamgir,S148
Sarai Mahajir,S231
Sarai Naurang,S280
Saranan,S508
Sarawan,S509
Satiana,S57
Sayedwala,S571
Sehnsa,S584
Sehwan,S350
Seo,S273
Shabqadar,S254
Shah Alam,S306
Shah Bandar,S406
Shah Jeewna,S194
Shahdadkot,S384
Shahdadpur,S393
Shahkot,S9
Shahrag,S510
Shakardara,S215
Shakargarh,S133
Shalkani,S435
Sharaqpur,S63
Sharda,S585
Sharingal,S329
Sheikhupura,S2
Sherani,S511
Shigar,S586
Shikarpur,S400
Shinaki,S587
Shorkot,S50
Shorkot Cantt,S51
Shujabad,S83
Sial Sharif,S196
Sialkot,S127
Sibi,S512
Sijawal Junejo,S388
Sillanwali,S183
Sindhri,S378
Sinjhoro,S394
Skardu,S588
Sobhodero,S366
Sohawa,S151
Sohbatpur,S513
Sonmiani,S514
Sui,S515
Sujawal,S402
Sukkur,S407
Swabi,S313
Taftan,S516
Takht Bhai,S294
Takht-e-Nasrati,S263
Talagang,S205
Talhar,S332
Tall,S259
Talwandi,S114
Tamboo,S517
Tandlianwala,S56
Tando Adam,S395
Tando Allahyar,S412
Tando Bago,S333
Tando Muhammad Khan,S414
Tangi,S253
Tangir,S589
Tangwani,S359
Tank,S323
Taunsa,S35
Thana,S289
Thano Bula Khan,S352
Thatta,S423
Thorar,S590
Thul,S348
Timergara,S283
Toba Tek Singh,S14
Toisar,S518
Topi,S314
Torkham,S432
Totalai,S251
Trarkhal,S591
Tump,S519
Turbat,S520
Ubauro,S342
Uch Sharif,S85
Umerkot,S428
Upper Kurram,S276
Upper Orakzai,S303
Usta Muhammad,S521
Uthal,S522
Utman Khel,S243
Vehari,S93
Vehova,S33
Wadh,S523
Wali Khel,S433
Wan Bhachran,S203
Warah,S389
Warburton,S6
Wari,S328
Wazirabad,S124
Zafarwal,S130
Zarghoon,S524
Zehri,S525
Zhob,S526
Ziarat,S527`;

const stops = {};
rawData.split('\n').forEach((line) => {
  const parts = line.split(',');
  if (parts.length === 2) {
    const name = parts[0].trim();
    const id = parts[1].trim();
    if (name && id) {
      stops[name] = { id };
    }
  }
});

const output = { stops };

fs.writeFileSync('/public/data/stops_index.json', JSON.stringify(output, null, 2));
console.log('Successfully generated public/data/stops_index.json');
