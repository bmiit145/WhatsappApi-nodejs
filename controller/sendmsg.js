const ContactModel = require("../models/number/Contacts");

require('dotenv').config();
const { sendMessage, getTextMessageInput, getTemplatedMessageInput, getImageTemplateInput } = require("../messageHelper");
const { uploadMedia } = require("../utils/mediaUpload");

// Path to the grand opening image
const IMAGE_PATH = "/Users/priyanksutariya/Downloads/madhav.jpeg";

// Load rate limiting configuration
const RATE_LIMIT_CONFIG = require('../config/rateLimitConfig');

// Utility function to sleep/delay execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Process messages in batches with rate limiting
async function sendMessagesWithRateLimit(numbers, messageFunction) {
    const results = [];
    const totalMessages = numbers.length;
    
    for (let i = 0; i < totalMessages; i++) {
        const number = numbers[i];
        const batchPosition = i % RATE_LIMIT_CONFIG.MESSAGES_PER_BATCH;
        
        try {
            // Send message with retry logic
            const result = await sendWithRetry(number, messageFunction);
            results.push(result);
            
            console.log(`[${i + 1}/${totalMessages}] Processed: ${number} - ${result.success ? 'Success' : 'Failed'}`);
            
            // Delay between individual messages
            if (i < totalMessages - 1) {
                await sleep(RATE_LIMIT_CONFIG.DELAY_BETWEEN_MESSAGES);
            }
            
            // Take a longer break after completing a batch
            if (batchPosition === RATE_LIMIT_CONFIG.MESSAGES_PER_BATCH - 1 && i < totalMessages - 1) {
                console.log(`📊 Completed batch of ${RATE_LIMIT_CONFIG.MESSAGES_PER_BATCH} messages. Taking a ${RATE_LIMIT_CONFIG.DELAY_BETWEEN_BATCHES}ms break...`);
                await sleep(RATE_LIMIT_CONFIG.DELAY_BETWEEN_BATCHES);
            }
            
        } catch (err) {
            console.error(`Failed to process ${number}:`, err.message);
            results.push({ success: false, number, error: err.message });
        }
    }
    
    return results;
}

// Send message with retry logic for rate limit errors
async function sendWithRetry(number, messageFunction, retryCount = 0) {
    try {
        const data = messageFunction(number);
        const response = await sendMessage(data);
        return { success: true, number, response: response.data };
    } catch (err) {
        const isRateLimitError = err.response?.status === 429 || 
                                 err.response?.status === 400 ||
                                 err.response?.data?.error?.code === 130429 || // WhatsApp rate limit error code
                                 err.message?.includes('rate limit');
        
        // Retry if it's a rate limit error and we haven't exceeded max retries
        if (isRateLimitError && retryCount < RATE_LIMIT_CONFIG.MAX_RETRIES) {
            console.log(`⚠️  Rate limit hit for ${number}. Retrying in ${RATE_LIMIT_CONFIG.RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${RATE_LIMIT_CONFIG.MAX_RETRIES})`);
            await sleep(RATE_LIMIT_CONFIG.RETRY_DELAY);
            return sendWithRetry(number, messageFunction, retryCount + 1);
        }
        
        // If not a rate limit error or max retries exceeded, throw the error
        throw err;
    }
}

module.exports = exports = {
    sendMsg: (req, res) => {
        // res.send("Test Successfully");

        var data = getTextMessageInput(process.env.RECIPIENT_WAID, 'Spirit Solutions');

        sendMessage(data).then((respose) => {
            console.log("success");
            // res.redirect('/');
            // res.sendStatus(200);
            res.send("sent");               // response  to main func
            return;
        }).catch((err) => {
            console.log("error");
            // res.send(err);
            return;
        })

    },

    // sendTempMsg: (req, res) => {
    //     var data = getTemplatedMessageInput(process.env.RECIPIENT_WAID);

    //     sendMessage(data).then(function (response) {
    //         console.log("Successfully template send", process.env.RECIPIENT_WAID);
    //         res.send();                         // response  to main func
    //         return;
    //     }).catch(err => {
    //         // console.log("Not send On" , process.env.RECIPIENT_WAID);
    //         console.log(err);
    //         res.send(err);
    //         return;
    //     })
    // },

    sendTempMsg: async (req, res) => {

        const arr = [
            "919909011082", "918140288000",
            // Section 1 (formatted from spaced numbers)
            "919824534403", "919824639868", "919825186367", "919879384785", "919879686959",
            "919879708826", "919913786293", "919924766811", "919925299594", "919925922100",
            "447774950734", "917600243325", "918140964623", "919662344064", "919687795989",
            "919712964623", "919723856045", "919323299874", "918153030593", "919586697480",
            "919913656093", "919723698723", "918758571355", "919979193796", "919099761070",
            "919979152733", "917874528387", "919081887223", "919099326573", "919769845945",
            "919825442407", "919909405137", "919724085651", "919898702439", "919723326552",
            "919913184110", "919898302225", "919898707598", "919510252536", "918780073927",
            "918141938329", "919737240832", "919320761407", "919824498845", "918866175323",
            "919320761406", "919638496022", "919909649793", "916353594986", "917202848330",
            "917573062748", "919924612014", "919824169692",
            // Section 2 (pre-formatted)
            "919824744641", "919925288711", "919978266312", "919825625705", "919879412792",
            "919824731350", "918000008837", "919375584744", "919586747873", "919327153377",
            "919979877910", "919879214293", "919925608530", "919725502562", "919377132753",
            "919537106481", "918238268584", "919586640380", "919925376148", "919913356816",
            "919825171641", "919727694293", "919825416215", "919924677991", "918238262045",
            "919879145474", "919879333938", "919687523448", "919537182187", "918866993727",
            "916356342543", "919825399681", "919825265166", "919825275767", "919662533999",
            "919979146557", "919722117476", "919879065661", "919099205112", "919099111656",
            "919374656056", "919725170737", "919909215748", "916355388049", "919712436009",
            "919727733613", "919537926388", "919081816095", "919879172688", "919978044612",
            "919099799223", "919924910984", "919375220448", "919574567778", "919033469083",
            "919879052327", "919924864755", "919913653480", "917621036169", "919909508481",
            "919879292855", "919484694515", "919067446744", "919824753963", "918000032232",
            "917041173772", "919879350939", "919974922540", "917043583848", "919879916950",
            "919824962309", "919979911373", "919726369599", "919601709211", "918758816288",
            "918140568168", "917041497677", "919913183569", "917698715881", "919512779297",
            "919825333150", "919978799357", "918980304216", "918347250007", "919879299302",
            "919924066322", "919974383184", "917048788501", "919825237631", "919913382372",
            "919427348848", "917201928926", "919586045932", "919712020371", "919727215043",
            "919726973063", "918866563163", "917621935795", "919978308810", "918905891766",
            "919099501515", "918153018499", "919913029546", "919824036095", "919909923393",
            "918238401810", "919898791168", "919898719243", "919924515037", "919913064014",
            "919913769596", "918000533435", "919979375402", "919898153970", "919925347143",
            "919099350787", "919879740748", "919909407357", "919825684227", "919978234149",
            "918849760228", "919824747554", "919979242341", "919428148703", "919016850238",
            "919723583951", "919537720578", "919712965759", "919879378862", "919925558684",
            "919825681304", "919925681677", "918140363754", "919819819529", "919328020743",
            "918487981858", "919924919944", "919909086197", "919879209992", "919979013763",
            "919925381059", "919913657307", "919712765589", "918153904255", "917405507455",
            "919687970553", "919979622536", "919377392823", "919328152112", "919979442583",
            "919979564048", "919924960005", "919033641634", "919879736965", "919510645808",
            "919825883902", "919879373264", "919904844248", "919909243146", "919978153189",
            "919712961439", "919737072730", "919879749439", "919727638258", "919723792558",
            "919924045348", "919913785906", "919879475402", "917990299986", "919313312151",
            "919723583835", "918238367589", "919879177566", "919824632779", "919624763127",
            "919904396013", "919978080451", "919879750492", "918758987572", "918141812131",
            "919723301592", "919624438019", "919727171472", "919925841332", "919033342484",
            "917574047817", "918866223356", "919898346458", "919574405055", "919979735257",
            "919429329985", "919978045553", "918238236011", "919662440031", "919723276281",
            "919722223370", "919925423574", "919825146769", "919376722166", "919979697646",
            "919879418551", "919909911196", "919978831306", "918980946296", "917434822153",
            "918264747424", "917567030519", "919099909094", "919067233570", "919825753462",
            "919601010535", "919824750099", "918866381598", "918153837380", "919879458359",
            "919979555063", "919016630014", "919727097179", "919825845165", "919909457571",
            "917600476305", "917777942221", "919898255568", "919824375631", "919998403737",
            "919879740259", "919727180944", "919879184300", "919737094094", "919879360831",
            "916353523051", "919979284091", "919979266596", "917622013910", "919033769895",
            "917575882237", "916353319548", "919913914026", "919727255956", "919879936296",
            "919924489376", "919726233555", "918140084341", "919979573032", "919824774797",
            "919104854548", "919662282232", "919725232394", "918460025735", "919925423016",
            "917069592564", "919925073884", "918155892624", "919904825865", "12487220204",
            "919898175706", "919974859759", "917778849210", "919825239256", "918401740064",
            "919510997227", "918320494080", "919924734461", "919727161567", "919824745451",
            "919624435222", "919825258168", "919978153199", "918154976504", "919724897783",
            "918128553299", "919824028883", "919913008090", "919427396984", "919978801955",
            "919016165000", "919825094209", "919833689562", "919925756207", "919824910308",
            "919624999444", "919879478463", "919638880545", "918140690516", "917862044684",
            "917201848193", "918460253554", "919913727626", "919909243152", "919998750229",
            "919227383091", "919824435222", "919924360062", "918469877055", "919825546252",
            "919727390710", "919979461907", "919726343099", "919913920508", "919898981032",
            "917984346053", "919913098253", "919924096110", "919998858000", "919537815460",
            "919879355873", "919978825727", "917567097949", "917874261554", "919925847879",
            "919825130396", "919512573425", "919723662805", "919913857086", "919824416768",
            "919824961751", "919879823982", "919909095285", "919979195045", "919727203273",
            "919979013871", "917778803999", "918141025541", "919099358936", "919925905861",
            "919879279520", "919558596337", "919825673806", "918320311206", "919924864963",
            "919924896642", "919979244925", "919978965149", "919925320745", "919274593235",
            "919558207112", "919898107737", "919879416951", "919724005103", "919925850541",
            "918866241522", "916352536227", "919978901188", "918980981274", "919601663663",
            "918758686605", "919924555266", "917698002224", "919925741864", "919601386330",
            "919173939009", "919925601043", "916356432592", "919726405571", "919913656489",
            "919909360481", "919228304171", "919913163081", "919925056750", "918758472127",
            "919824933043", "919979435338", "916351903527", "919408867169", "919601711999",
            "919998759633", "919824491808", "919913354735", "919925596731", "919979043235",
            "919274540213", "919428854207", "919925054684", "919723417627", "919879705704",
            "919913755571", "919537407539", "919925133831", "919913355271", "919427745077",
            "918905764458", "917285834413", "919978506258", "919099361957", "919687415674",
            "919825622063", "919979473800", "919825540110", "919909365766", "919978101201",
            "919427794993", "919879280561",
            // Additional numbers
            "919316437370", "919374336444", "919375071175", "919537562636", "919574025755",
            "919687453904", "919712960444", "919714712891", "919726007101", "919727153016",
            "919824001518", "919824131127", "919825512891", "919825554771", "919825668485",
            "919825727169", "919825806373", "919825914031", "919879221760", "919904747010",
            "919924447892", "919825495862", "918000922325", "919624036724", "919925147752",
            "919925706137", "919909956066", "919924701223", "917990042653", "917567615767",
            "917818807088", "918000334366", "918153907879", "918320680810", "919033162339",
            "919033390321", "919033658677", "919099272156", "919316437370", "919879887687",
            "919909912999", "919374288493", "919998438406", "919925110942", "916351782900",
            "919879645722", "919979596021", "919510573179", "917096432060", "919825451850",
            "919825526355", "919558111008", "918444924424", "919879410631", "919909923072",
            "919377630921", "919825414570", "919879685835", "919925685469", "919913072270",
            "918980140993", "918511720007", "919898583142", "919824791693", "919714962666",
            "919825497460", "919825532631", "919913643439", "919879515184", "918866859550",
            "919727012133", "919998126598", "919727152288", "919879162077", "919979139199",
            "918690577521", "919824574519", "919979266084", "919727252341", "919723527195",
            "919428611218", "919724371808", "919725105557", "919725898768", "919824758283",
            "919879515121", "919909509616", "919924242900", "919925353539", "919925787817",
            "919925929135", "919714461329", "919898038051", "919510554208",
            // Recent additions
            "447555072167", "447587878784", "917069810545", "917265077790", "918320052962",
            "919825272453", "919825376833", "919904769023", "919909323234", "919925122844",
            "919638451788", "919898437066", "919913681839", "919904463659", "919925721474",
            "919820397837", "919879438442", "919316906392", "917567006611", "919925587383",
            "919898755409", "919979595998", "919974428477", "919904977748", "919898835498",
            "919016525278", "919537906691", "919662881887", "919879653368", "919825789033",
            "918155005455", "919825534495", "919925433924", "918866670788", "919879303920",
            "919726411703", "919727989018", "919825086215", "919909094466", "919978896064",
            "919824175003", "919662907879", "919909506440", "919727564373", "919714582144",
            "919374735271", "918160233856", "918980404078", "918460272686", "919909789549",
            "919825240730", "919714004598", "919376070297", "919537693647", "918200249489",
            "919825885086", "919879504466", "917016547621", "917567402731", "919909263977"
        ];

        try {
            // Step 1: Upload image to Meta and get media ID
            console.log(`📤 Uploading image: ${IMAGE_PATH}`);
            const mediaId = await uploadMedia(IMAGE_PATH, 'image');
            console.log(`✅ Image uploaded! Media ID: ${mediaId}`);

            console.log(`\n📨 Sending template "project_information_event" (gu) with image to ${arr.length} contacts...`);
            console.log(`Rate limit: ${RATE_LIMIT_CONFIG.MESSAGES_PER_BATCH} msgs/batch, ${RATE_LIMIT_CONFIG.DELAY_BETWEEN_BATCHES}ms between batches`);
            
            // Step 2: Send template with image to all contacts with rate limiting
            const results = await sendMessagesWithRateLimit(
                arr,
                (number) => getImageTemplateInput(number, mediaId)
            );
            
            const successCount = results.filter(r => r.success).length;
            const failureCount = results.filter(r => !r.success).length;
            
            console.log(`\n=== Summary ===`);
            console.log(`Total: ${results.length} | Success: ${successCount} | Failed: ${failureCount}`);
            
            res.json({ 
                message: "Completed with rate limiting", 
                mediaId,
                summary: {
                    total: results.length,
                    success: successCount,
                    failed: failureCount
                },
                results 
            });
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    },

    sendMultiContact: async (req, res) => {
        try {
            // Step 1: Upload image to Meta and get media ID
            console.log(`📤 Uploading image: ${IMAGE_PATH}`);
            const mediaId = await uploadMedia(IMAGE_PATH, 'image');
            console.log(`✅ Image uploaded! Media ID: ${mediaId}`);

            const contacts = await ContactModel.find();
            const numbers = contacts.map(contact => contact.mo_no);
            
            console.log(`\n📨 Sending template "project_information_event" (gu) with image to ${numbers.length} contacts from database...`);
            console.log(`Rate limit: ${RATE_LIMIT_CONFIG.MESSAGES_PER_BATCH} msgs/batch, ${RATE_LIMIT_CONFIG.DELAY_BETWEEN_BATCHES}ms between batches`);
            
            // Step 2: Send template with image to all contacts
            const results = await sendMessagesWithRateLimit(
                numbers,
                (number) => getImageTemplateInput(number, mediaId)
            );
            
            const successCount = results.filter(r => r.success).length;
            const failureCount = results.filter(r => !r.success).length;
            
            console.log(`\n=== Summary ===`);
            console.log(`Total: ${results.length} | Success: ${successCount} | Failed: ${failureCount}`);

            res.json({ 
                message: "Successfully sent with rate limiting", 
                mediaId,
                summary: {
                    total: results.length,
                    success: successCount,
                    failed: failureCount
                },
                results 
            });
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    },

    // Upload image and send it with template
    uploadAndSendTemplateWithImage: async (req, res) => {
        try {
            // Get file path from request (can be from body or uploaded file)
            const filePath = req.body.filePath || req.file?.path;
            
            if (!filePath) {
                return res.status(400).json({ error: "File path is required" });
            }

            console.log(`📤 Starting to upload image: ${filePath}`);
            
            // Step 1: Upload image to WhatsApp to get media ID
            const mediaId = await uploadMedia(filePath, 'image');
            console.log(`✅ Image uploaded! Media ID: ${mediaId}`);

            // Step 2: Send template messages with the image to all contacts
            const contacts = await ContactModel.find();
            const numbers = contacts.map(contact => contact.mo_no);
            
            console.log(`\n📨 Starting to send grand opening template with image to ${numbers.length} contacts...`);
            console.log(`Rate limit config: ${RATE_LIMIT_CONFIG.MESSAGES_PER_BATCH} msgs/batch, ${RATE_LIMIT_CONFIG.DELAY_BETWEEN_BATCHES}ms between batches`);
            
            // Use the message function with media ID
            const results = await sendMessagesWithRateLimit(
                numbers, 
                (number) => getImageTemplateInput(number, mediaId)
            );
            
            const successCount = results.filter(r => r.success).length;
            const failureCount = results.filter(r => !r.success).length;
            
            console.log(`\n=== Summary ===`);
            console.log(`Total: ${results.length} | Success: ${successCount} | Failed: ${failureCount}`);

            res.json({ 
                message: "Templates with image sent successfully with rate limiting", 
                mediaId: mediaId,
                summary: {
                    total: results.length,
                    success: successCount,
                    failed: failureCount
                },
                results 
            });
        } catch (err) {
            console.log("Error:", err);
            res.status(500).json({ error: err.message });
        }
    },

    // Just upload image and get media ID
    uploadImage: async (req, res) => {
        try {
            const filePath = req.body.filePath || req.file?.path;
            
            if (!filePath) {
                return res.status(400).json({ error: "File path is required" });
            }

            console.log(`📤 Uploading image: ${filePath}`);
            const mediaId = await uploadMedia(filePath, 'image');
            
            res.json({ 
                message: "Image uploaded successfully",
                mediaId: mediaId,
                filePath: filePath
            });
        } catch (err) {
            console.log("Error:", err);
            res.status(500).json({ error: err.message });
        }
    },

    // Send template with existing media ID
    sendTemplateWithMediaId: async (req, res) => {
        try {
            const { mediaId } = req.body;
            
            if (!mediaId) {
                return res.status(400).json({ error: "mediaId is required" });
            }

            const contacts = await ContactModel.find();
            const numbers = contacts.map(contact => contact.mo_no);
            
            console.log(`📨 Sending template "project_information_event" with mediaId: ${mediaId} to ${numbers.length} contacts...`);
            console.log(`Rate limit: ${RATE_LIMIT_CONFIG.MESSAGES_PER_BATCH} msgs/batch, ${RATE_LIMIT_CONFIG.DELAY_BETWEEN_BATCHES}ms between batches`);
            
            const results = await sendMessagesWithRateLimit(
                numbers, 
                (number) => getImageTemplateInput(number, mediaId)
            );
            
            const successCount = results.filter(r => r.success).length;
            const failureCount = results.filter(r => !r.success).length;
            
            console.log(`\n=== Summary ===`);
            console.log(`Total: ${results.length} | Success: ${successCount} | Failed: ${failureCount}`);

            res.json({ 
                message: "Templates sent successfully with rate limiting", 
                summary: {
                    total: results.length,
                    success: successCount,
                    failed: failureCount
                },
                results 
            });
        } catch (err) {
            console.log("Error:", err);
            res.status(500).json({ error: err.message });
        }
    }


}